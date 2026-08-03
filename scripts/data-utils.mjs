import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

export const root = resolve(import.meta.dirname, '..')
export const dataDir = resolve(root, 'shared-data')
export const allowedBrands = ['NIKE', 'ADIDAS', 'NEW_BALANCE', 'CROCS', 'PUMA']
export const requiredCategories = ['running-shoes', 'sneakers', 'slides', 'flip-flops', 'clogs']
export const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

export function assertSnapshot(products) {
  const errors = []; const brands = new Map(); const slugs = new Set(); const ids = new Set(); const names = new Set(); const urls = new Set(); const categories = new Set()
  if (!Array.isArray(products) || products.length !== 50) errors.push('products.json must contain exactly 50 products.')
  for (const product of products) {
    brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1); categories.add(product.category)
    for (const [set, value, label] of [[ids, product.id, 'ID'], [slugs, product.slug, 'slug'], [names, product.name, 'name'], [urls, product.sourceUrl, 'sourceUrl']]) { if (set.has(value)) errors.push(`Duplicate ${label}: ${value}`); set.add(value) }
    if (!/^product-\d{3}$/.test(product.id)) errors.push(`Invalid ID: ${product.id}`)
    if (!product.name || !product.color || !product.imageAlt) errors.push(`Missing text field: ${product.id}`)
    if (!allowedBrands.includes(product.brand)) errors.push(`Unsupported brand: ${product.brand}`)
    if (!requiredCategories.includes(product.category)) errors.push(`Unsupported category: ${product.category}`)
    if (!Number.isInteger(product.price) || product.price <= 0) errors.push(`Invalid price: ${product.slug}`)
    if (product.originalPrice !== null && (!Number.isInteger(product.originalPrice) || product.originalPrice <= product.price)) errors.push(`Invalid originalPrice: ${product.slug}`)
    if (product.onSale !== (product.originalPrice !== null && product.originalPrice > product.price)) errors.push(`Invalid onSale: ${product.slug}`)
    if (!/^https:\/\//.test(product.sourceUrl) || !/^https:\/\//.test(product.sourceImageUrl)) errors.push(`Invalid source URL: ${product.slug}`)
    if (!product.image.startsWith('/products/') || !existsSync(resolve(dataDir, 'images', 'benchmark', basename(product.image)))) errors.push(`Missing benchmark image: ${product.image}`)
    if ('rating' in product || 'stock' in product || 'sku' in product || 'size' in product) errors.push(`Forbidden field: ${product.slug}`)
  }
  if (brands.size !== 5) errors.push('Snapshot must contain exactly five brands.')
  for (const [brand, count] of brands) if (count !== 10) errors.push(`${brand} must have exactly 10 products, found ${count}.`)
  if (categories.size < 4) errors.push('Snapshot must contain at least four categories.')
  if (products.filter((product) => product.featured).length !== 10) errors.push('Snapshot must contain exactly 10 featured products.')
  if (errors.length) throw new Error(errors.join('\n'))
}
