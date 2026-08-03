import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { dataDir, readJson, sha256 } from './data-utils.mjs'

const products = readJson(resolve(dataDir, 'products.json'))
const manifest = readJson(resolve(dataDir, 'image-manifest.json'))
const byBrand = Object.fromEntries([...new Set(products.map((product) => product.brand))].map((brand) => [brand, products.filter((product) => product.brand === brand).length]))
const byCategory = Object.fromEntries([...new Set(products.map((product) => product.category))].map((category) => [category, products.filter((product) => product.category === category).length]))
const downloaded = manifest.entries.filter((entry) => entry.status === 'downloaded').length
const placeholders = manifest.entries.filter((entry) => entry.benchmarkStatus === 'placeholder').length
const failed = manifest.entries.filter((entry) => entry.status === 'failed').map((entry) => `- ${entry.sourceImageUrl}: ${entry.error}`)
const prices = products.map((product) => product.price)
const report = `# Source report\n\n- Source of truth: \`shared-data/manual-products-template.csv\` (50 manually entered rows).\n- CSV rows: ${products.length}.\n- Products per brand: ${JSON.stringify(byBrand)}.\n- Products per category: ${JSON.stringify(byCategory)}.\n- Price range: ${Math.min(...prices).toLocaleString('vi-VN')}–${Math.max(...prices).toLocaleString('vi-VN')} VND.\n- Sale products: ${products.filter((product) => product.onSale).length}.\n- Downloaded source images: ${downloaded}.\n- Benchmark placeholders: ${placeholders}.\n- Benchmark format: WebP, 800×600, contain fit, neutral background, quality 82.\n- Products checksum (SHA-256): \`${sha256(resolve(dataDir, 'products.json'))}\`.\n- Added fields: id, slug, currency, onSale, neutral description, image path, imageAlt, derived Wikimedia file-page sourceUrl, and featured flag.\n- Manual CSV fields name, brand, category, color, price, originalPrice, and sourceImageUrl were not changed.\n- No product search, scraping, source-image substitution, hotlinking, rating, stock, SKU, or size data was added.\n\n## Failed image URLs\n\n${failed.length ? failed.join('\n') : 'None.'}\n`
writeFileSync(resolve(dataDir, 'source-report.md'), report)
console.log('Source report updated.')
