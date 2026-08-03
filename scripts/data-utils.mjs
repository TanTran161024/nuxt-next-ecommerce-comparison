import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const root = resolve(import.meta.dirname, '..')
export const dataDir = resolve(root, 'shared-data')
export const allowedBrands = ['NIKE', 'ADIDAS', 'NEW_BALANCE', 'CROCS', 'PUMA', 'ASICS', 'HOKA']
export const requiredCategories = ['running-shoes', 'sneakers', 'slides', 'flip-flops', 'clogs']

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

export function assertSnapshot(products) {
  const errors = []
  if (!Array.isArray(products) || products.length !== 50) errors.push('products.json must contain exactly 50 products.')
  const brands = new Map()
  const slugs = new Set()
  const urls = new Set()
  const categories = new Set()
  for (const product of products) {
    brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1)
    categories.add(product.category)
    if (slugs.has(product.slug)) errors.push(`Duplicate slug: ${product.slug}`)
    slugs.add(product.slug)
    if (urls.has(product.sourceUrl)) errors.push(`Duplicate sourceUrl: ${product.sourceUrl}`)
    urls.add(product.sourceUrl)
    if (!allowedBrands.includes(product.brand)) errors.push(`Unsupported brand: ${product.brand}`)
    if (!requiredCategories.includes(product.category)) errors.push(`Unsupported category: ${product.category}`)
    if (!Number.isInteger(product.price) || product.price <= 0) errors.push(`Invalid price: ${product.slug}`)
    if (product.originalPrice !== null && (!Number.isInteger(product.originalPrice) || product.originalPrice <= product.price)) errors.push(`Invalid originalPrice: ${product.slug}`)
    if (product.onSale !== (product.originalPrice !== null && product.originalPrice > product.price)) errors.push(`Invalid onSale: ${product.slug}`)
    if (!/^https:\/\//.test(product.sourceUrl)) errors.push(`Invalid source URL: ${product.slug}`)
    if (Number.isNaN(Date.parse(product.capturedAt))) errors.push(`Invalid capturedAt: ${product.slug}`)
    if ('rating' in product || 'stock' in product || 'sku' in product) errors.push(`Forbidden field: ${product.slug}`)
    if (!existsSync(resolve(dataDir, product.image.slice(1)))) errors.push(`Missing local image: ${product.image}`)
  }
  if (brands.size !== 5) errors.push('Snapshot must contain exactly five brands.')
  for (const [brand, count] of brands) if (count !== 10) errors.push(`${brand} must have exactly 10 products, found ${count}.`)
  if (categories.size < 4) errors.push('Snapshot must contain at least four categories.')
  if (errors.length) throw new Error(errors.join('\n'))
}
