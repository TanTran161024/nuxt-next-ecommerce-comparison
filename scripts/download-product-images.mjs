import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { dataDir, readJson } from './data-utils.mjs'

const products = readJson(resolve(dataDir, 'products.json'))
const sourceDir = resolve(dataDir, 'images', 'source')
const manifestPath = resolve(dataDir, 'image-manifest.json')
const maxBytes = 20 * 1024 * 1024
const force = process.argv.includes('--force')
const retryFailed = process.argv.includes('--retry-failed')
const limitArgument = process.argv.find((argument) => argument.startsWith('--limit='))
const requestedLimit = limitArgument ? Number(limitArgument.slice('--limit='.length)) : Number.POSITIVE_INFINITY
const batchLimit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : Number.POSITIVE_INFINITY
const requestDelayMs = Math.max(Number(process.env.IMAGE_REQUEST_DELAY_MS ?? 300), 0)
const requestTimeoutMs = Math.max(Number(process.env.IMAGE_REQUEST_TIMEOUT_MS ?? 30_000), 1_000)
const requestedConcurrency = Number(process.env.IMAGE_DOWNLOAD_CONCURRENCY ?? 2)
const concurrency = Number.isInteger(requestedConcurrency) ? Math.min(Math.max(requestedConcurrency, 1), 2) : 2
mkdirSync(sourceDir, { recursive: true })
const extensionFor = (contentType, url) => ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' }[contentType.split(';')[0].toLowerCase()] ?? (extname(new URL(url).pathname) || '.img'))
const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms))

const getRetryAfterMs = (value) => {
  if (!value) return 0
  const seconds = Number(value)
  if (Number.isFinite(seconds)) return Math.max(seconds * 1_000, 0)
  const retryAt = Date.parse(value)
  return Number.isNaN(retryAt) ? 0 : Math.max(retryAt - Date.now(), 0)
}

async function download(product, previousEntry) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(previousEntry?.finalUrl ?? product.sourceImageUrl, {
        redirect: 'follow',
        headers: { 'User-Agent': 'FrameworkComparisonDataset/1.0' },
        signal: AbortSignal.timeout(requestTimeoutMs),
      })
      const contentType = response.headers.get('content-type') ?? ''
      const length = Number(response.headers.get('content-length') ?? 0)
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`)
        if (response.status === 429) error.retryAfterMs = getRetryAfterMs(response.headers.get('retry-after'))
        error.finalUrl = response.url
        throw error
      }
      if (!contentType.toLowerCase().startsWith('image/')) throw new Error(`Unexpected Content-Type ${contentType}`)
      if (length > maxBytes) throw new Error(`Image exceeds ${maxBytes} bytes`)
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length > maxBytes) throw new Error(`Image exceeds ${maxBytes} bytes`)
      const extension = extensionFor(contentType, response.url)
      const path = resolve(sourceDir, `${product.slug}${extension}`)
      writeFileSync(path, buffer)
      return { slug: product.slug, sourceImageUrl: product.sourceImageUrl, finalUrl: response.url, status: 'downloaded', path: `images/source/${product.slug}${extension}`, contentType, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), attempts: attempt }
    } catch (error) {
      const finalUrl = error instanceof Error && typeof error.finalUrl === 'string' ? error.finalUrl : previousEntry?.finalUrl
      const retryAfterMs = error instanceof Error && typeof error.retryAfterMs === 'number' ? error.retryAfterMs : 0
      if (retryAfterMs > 0 || attempt === 2) return { slug: product.slug, sourceImageUrl: product.sourceImageUrl, finalUrl, retryAfterAt: retryAfterMs ? new Date(Date.now() + retryAfterMs).toISOString() : undefined, status: 'failed', error: error.message, attempts: attempt }
      await delay(Math.max(requestDelayMs, 750))
    }
  }
}

const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).entries ?? [] : []
const previousBySlug = new Map(previous.map((entry) => [entry.slug, entry]))
for (const product of products) { const filename = readdirSync(sourceDir).find((file) => file.startsWith(`${product.slug}.`)); if (filename && previousBySlug.get(product.slug)?.status !== 'downloaded') { const path = resolve(sourceDir, filename); const buffer = readFileSync(path); previousBySlug.set(product.slug, { slug: product.slug, sourceImageUrl: product.sourceImageUrl, status: 'downloaded', path: `images/source/${filename}`, contentType: `image/${extname(filename).slice(1)}`, bytes: statSync(path).size, sha256: createHash('sha256').update(buffer).digest('hex'), attempts: 1 }) } }
const shouldDownload = (product) => force || !previousBySlug.has(product.slug) || (retryFailed && previousBySlug.get(product.slug).status === 'failed' && (!previousBySlug.get(product.slug).retryAfterAt || new Date(previousBySlug.get(product.slug).retryAfterAt) <= new Date()))
const pending = products.filter(shouldDownload).slice(0, batchLimit)
const entries = products.map((product) => previousBySlug.get(product.slug)).filter(Boolean)
const writeManifest = () => {
  entries.sort((a, b) => a.slug.localeCompare(b.slug))
  writeFileSync(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), maxBytes, entries }, null, 2)}\n`)
}
async function worker() {
  while (pending.length) {
    const product = pending.shift()
    const entry = await download(product, previousBySlug.get(product.slug))
    const entryIndex = entries.findIndex((existingEntry) => existingEntry.slug === product.slug)
    if (entryIndex === -1) entries.push(entry)
    else entries[entryIndex] = entry
    writeManifest()
    await delay(requestDelayMs)
  }
}
await Promise.all(Array.from({ length: concurrency }, worker))
writeManifest()
console.log(`Image download complete: ${entries.filter((entry) => entry.status === 'downloaded').length} downloaded, ${entries.filter((entry) => entry.status === 'failed').length} failed, ${products.length - products.filter(shouldDownload).length} reused.`)
