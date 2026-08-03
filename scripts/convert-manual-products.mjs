import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { dataDir, requiredCategories } from './data-utils.mjs'

const csvPath = resolve(dataDir, 'manual-products-template.csv')
const [header, ...rows] = readFileSync(csvPath, 'utf8').trim().split(/\r?\n/)
const fields = header.split(',')
const brandLabels = { NIKE: 'Nike', ADIDAS: 'Adidas', NEW_BALANCE: 'New Balance', CROCS: 'Crocs', PUMA: 'Puma' }
const categoryLabels = { 'running-shoes': 'Giày chạy bộ', sneakers: 'Giày sneaker', slides: 'Dép quai ngang', 'flip-flops': 'Dép xỏ ngón', clogs: 'Giày clog' }
const slugify = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const toFilePage = (url) => url.replace('/wiki/Special:Redirect/file/', '/wiki/File:').replace('%2B', '+')
const input = rows.filter(Boolean).map((row) => Object.fromEntries(row.split(',').map((value, index) => [fields[index], value.trim()])))
const seenSlugs = new Set()
const products = input.map((record, index) => {
  const slug = slugify(record.name)
  if (seenSlugs.has(slug)) throw new Error(`Duplicate slug from CSV name: ${record.name}`)
  seenSlugs.add(slug)
  const price = Number.parseInt(record.price, 10)
  const originalPrice = record.originalPrice ? Number.parseInt(record.originalPrice, 10) : null
  return {
    id: `product-${String(index + 1).padStart(3, '0')}`, name: record.name, slug, brand: record.brand, category: record.category, color: record.color,
    price, originalPrice, currency: 'VND', onSale: originalPrice !== null && originalPrice > price,
    description: `Sản phẩm ${categoryLabels[record.category] ?? 'giày dép'} ${brandLabels[record.brand] ?? record.brand} màu ${record.color}, được sử dụng trong mô hình website thương mại điện tử phục vụ nghiên cứu framework.`,
    image: `/products/${slug}.webp`, imageAlt: `${record.name} màu ${record.color}`,
    sourceUrl: record.sourceUrl || toFilePage(record.sourceImageUrl), sourceImageUrl: record.sourceImageUrl,
    featured: false,
  }
})
for (const brand of Object.keys(brandLabels)) {
  const candidates = products.filter((product) => product.brand === brand)
  const first = candidates[0]
  const second = candidates.find((product) => product.category !== first.category) ?? candidates[1]
  first.featured = true
  second.featured = true
}
const brands = Object.keys(brandLabels).map((value) => ({ value, label: brandLabels[value], productCount: products.filter((product) => product.brand === value).length }))
const categories = requiredCategories.filter((value) => products.some((product) => product.category === value)).map((value) => ({ value, label: categoryLabels[value], productCount: products.filter((product) => product.category === value).length }))
writeFileSync(resolve(dataDir, 'products.json'), `${JSON.stringify(products, null, 2)}\n`)
writeFileSync(resolve(dataDir, 'brands.json'), `${JSON.stringify(brands, null, 2)}\n`)
writeFileSync(resolve(dataDir, 'categories.json'), `${JSON.stringify(categories, null, 2)}\n`)
console.log(`Created official JSON for ${products.length} manual CSV rows.`)
