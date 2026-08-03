import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { dataDir, readJson } from './data-utils.mjs'

const products = readJson(resolve(dataDir, 'products.json'))
const sourceDir = resolve(dataDir, 'images', 'source')
const manifestPath = resolve(dataDir, 'image-manifest.json')
const maxBytes = 20 * 1024 * 1024
const force = process.argv.includes('--force')
mkdirSync(sourceDir, { recursive: true })
const extensionFor = (contentType, url) => ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' }[contentType.split(';')[0].toLowerCase()] ?? (extname(new URL(url).pathname) || '.img'))
const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms))

async function download(product) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(product.sourceImageUrl, { redirect: 'follow', headers: { 'User-Agent': 'FrameworkComparisonDataset/1.0' } })
      const contentType = response.headers.get('content-type') ?? ''
      const length = Number(response.headers.get('content-length') ?? 0)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!contentType.toLowerCase().startsWith('image/')) throw new Error(`Unexpected Content-Type ${contentType}`)
      if (length > maxBytes) throw new Error(`Image exceeds ${maxBytes} bytes`)
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length > maxBytes) throw new Error(`Image exceeds ${maxBytes} bytes`)
      const extension = extensionFor(contentType, response.url)
      const path = resolve(sourceDir, `${product.slug}${extension}`)
      writeFileSync(path, buffer)
      return { slug: product.slug, sourceImageUrl: product.sourceImageUrl, finalUrl: response.url, status: 'downloaded', path: `images/source/${product.slug}${extension}`, contentType, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), attempts: attempt }
    } catch (error) {
      if (attempt === 2) return { slug: product.slug, sourceImageUrl: product.sourceImageUrl, status: 'failed', error: error.message, attempts: attempt }
      await delay(750)
    }
  }
}

const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).entries ?? [] : []
const previousBySlug = new Map(previous.map((entry) => [entry.slug, entry]))
const pending = products.filter((product) => force || !previousBySlug.has(product.slug)); const entries = products.filter((product) => !force && previousBySlug.has(product.slug)).map((product) => previousBySlug.get(product.slug))
async function worker() { while (pending.length) { const product = pending.shift(); entries.push(await download(product)); await delay(300) } }
await Promise.all([worker(), worker()])
entries.sort((a, b) => a.slug.localeCompare(b.slug))
writeFileSync(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), maxBytes, entries }, null, 2)}\n`)
console.log(`Image download complete: ${entries.filter((entry) => entry.status === 'downloaded').length} downloaded, ${entries.filter((entry) => entry.status === 'failed').length} failed, ${products.length - pending.length} reused.`)
