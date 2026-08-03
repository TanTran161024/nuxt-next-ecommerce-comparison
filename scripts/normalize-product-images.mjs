import { mkdirSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import sharp from 'sharp'
import { dataDir, readJson } from './data-utils.mjs'

const products = readJson(resolve(dataDir, 'products.json'))
const manifestPath = resolve(dataDir, 'image-manifest.json')
const manifest = readJson(manifestPath)
const benchmarkDir = resolve(dataDir, 'images', 'benchmark')
mkdirSync(benchmarkDir, { recursive: true })
const bySlug = new Map(manifest.entries.map((entry) => [entry.slug, entry]))
const placeholder = (product) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="400" y="280" text-anchor="middle" font-family="Arial" font-size="28" fill="#0f172a">${product.brand}</text><text x="400" y="330" text-anchor="middle" font-family="Arial" font-size="22" fill="#334155">${product.name.replace(/[&<>]/g, '')}</text></svg>`)
for (const product of products) {
  const entry = bySlug.get(product.slug); const destination = resolve(benchmarkDir, `${product.slug}.webp`)
  try {
    const input = entry?.status === 'downloaded' ? resolve(dataDir, entry.path) : placeholder(product)
    await sharp(input, { animated: false }).resize(800, 600, { fit: 'contain', background: '#f1f5f9', withoutEnlargement: true }).webp({ quality: 82 }).toFile(destination)
    entry.benchmarkPath = `images/benchmark/${basename(destination)}`; entry.benchmarkStatus = entry.status === 'downloaded' ? 'normalized' : 'placeholder'
  } catch (error) {
    await sharp(placeholder(product)).webp({ quality: 82 }).toFile(destination)
    entry.benchmarkPath = `images/benchmark/${basename(destination)}`; entry.benchmarkStatus = 'placeholder'; entry.normalizationError = error.message
  }
}
manifest.benchmark = { format: 'webp', width: 800, height: 600, fit: 'contain', quality: 82 }
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log('Benchmark image normalization complete.')
