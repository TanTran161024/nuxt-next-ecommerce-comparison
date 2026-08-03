import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { assertSnapshot, dataDir, requiredCategories } from './data-utils.mjs'

const path = resolve(dataDir, 'manual-products-template.csv')
const [header, ...rows] = readFileSync(path, 'utf8').trim().split(/\r?\n/)
const fields = header.split(',')
const capturedAt = new Date().toISOString()
const slugify = (value) => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const records = rows.filter(Boolean).map((row, index) => {
  const input = Object.fromEntries(row.split(',').map((value, fieldIndex) => [fields[fieldIndex], value.trim()]))
  const sourceUrl = input.sourceUrl || null
  const slug = sourceUrl ? sourceUrl.split('/').filter(Boolean).at(-1) : slugify(input.name)
  const price = Number.parseInt(input.price, 10)
  const originalPrice = input.originalPrice ? Number.parseInt(input.originalPrice, 10) : null
  return {
    id: `manual-${String(index + 1).padStart(3, '0')}`, name: input.name, slug, brand: input.brand, category: input.category, color: input.color,
    price, originalPrice, currency: 'VND', onSale: originalPrice !== null && originalPrice > price,
    description: `${input.name} màu ${input.color}, được dùng làm dữ liệu mẫu có cấu trúc cho website thương mại điện tử trong nghiên cứu framework.`,
    image: `/products/${slug}.svg`, sourceImageUrl: input.sourceImageUrl || null, sourceUrl, featured: index < 8, capturedAt,
  }
})
mkdirSync(resolve(dataDir, 'images'), { recursive: true })
for (const product of records) {
  const label = `${product.brand} · ${product.category} · ${product.color}`.replace(/[&<>]/g, '')
  writeFileSync(resolve(dataDir, 'images', basename(product.image)), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${label}"><rect width="800" height="600" fill="#e2e8f0"/><text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="28" fill="#0f172a">${label}</text></svg>`)
}
assertSnapshot(records)
writeFileSync(resolve(dataDir, 'products.json'), `${JSON.stringify(records, null, 2)}\n`)
const brands = [...new Set(records.map((product) => product.brand))].map((id) => ({ id, name: id.replace('_', ' ') }))
writeFileSync(resolve(dataDir, 'brands.json'), `${JSON.stringify(brands, null, 2)}\n`)
writeFileSync(resolve(dataDir, 'categories.json'), `${JSON.stringify(requiredCategories.map((id) => ({ id })), null, 2)}\n`)
console.log(`Converted ${records.length} manually supplied products into the shared snapshot.`)
