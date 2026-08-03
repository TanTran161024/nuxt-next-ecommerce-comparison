import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { allowedBrands, dataDir, requiredCategories, root } from './data-utils.mjs'

const origin = 'https://supersports.com.vn'
const collections = {
  NIKE: '/collections/nike', ADIDAS: '/collections/adidas', NEW_BALANCE: '/collections/new-balance', CROCS: '/collections/crocs', PUMA: '/collections/puma', ASICS: '/collections/asics', HOKA: '/collections/hoka',
}
const force = process.argv.includes('--force')
const dryRun = process.argv.includes('--dry-run')
const output = resolve(dataDir, 'products.json')
let lastRequestAt = 0

async function fetchPublic(path) {
  const wait = 1200 - (Date.now() - lastRequestAt)
  if (wait > 0) await new Promise((resolveWait) => setTimeout(resolveWait, wait))
  lastRequestAt = Date.now()
  const response = await fetch(`${origin}${path}`, { headers: { 'User-Agent': 'FrameworkComparisonDataset/1.0 (+educational snapshot)' }, redirect: 'follow' })
  if ([403, 429].includes(response.status)) throw new Error(`ACCESS_BLOCKED ${response.status} for ${path}; no bypass attempted.`)
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`)
  return response.text()
}

function robotsAllow(robots, path) {
  const rules = robots.split(/\r?\n/).map((line) => line.trim())
  let applies = false
  for (const line of rules) {
    if (/^user-agent:\s*\*/i.test(line)) applies = true
    else if (/^user-agent:/i.test(line)) applies = false
    else if (applies && /^disallow:/i.test(line)) {
      const blocked = line.split(':').slice(1).join(':').trim()
      if (blocked && path.startsWith(blocked.replace(/\*/g, ''))) return false
    }
  }
  return true
}

function categoryFrom(name) {
  const lower = name.toLowerCase()
  if (lower.includes('giày chạy bộ')) return 'running-shoes'
  if (lower.includes('giày sneaker') || lower.includes('giày thời trang')) return 'sneakers'
  if (lower.includes('dép quai ngang')) return 'slides'
  if (lower.includes('dép xỏ ngón')) return 'flip-flops'
  if (lower.includes('giày clog')) return 'clogs'
  return null
}

function parsePrice(value) {
  const digits = value.replace(/[^0-9]/g, '')
  return digits ? Number.parseInt(digits, 10) : null
}

function parseCards(html, expectedBrand) {
  const cards = html.split(/<div class="boost-pfs-filter-product-item /).slice(1)
  const items = []
  for (const card of cards) {
    const anchor = card.match(/href="(?:\/collections\/[^/]+)?\/products\/([^"#?]+)[^\"]*"[^>]*class="boost-pfs-filter-product-item-(?:image-link|title)/)
    const title = card.match(/boost-pfs-filter-product-item-title">([^<]+)</)
    const vendor = card.match(/boost-pfs-filter-product-item-vendor">([^<]+)</)
    const image = card.match(/data-img-flip-src="([^"]+)"/)
    const prices = [...card.matchAll(/(?:regular-price|sale-price)[^>]*>([^<]+)</g)].map((match) => parsePrice(match[1])).filter(Boolean)
    if (!anchor || !title || !vendor || !image || prices.length === 0) continue
    const brand = vendor[1].trim().toUpperCase().replace('NEW BALANCE', 'NEW_BALANCE')
    const category = categoryFrom(title[1].trim())
    if (brand !== expectedBrand || !category) continue
    const name = title[1].trim()
    const color = name.split(' - ').at(-1) || 'Không xác định'
    const sourceImageUrl = image[1].startsWith('//') ? `https:${image[1]}` : image[1]
    const originalPrice = prices.length > 1 ? Math.max(...prices) : null
    const price = prices.length > 1 ? Math.min(...prices) : prices[0]
    items.push({ name, slug: anchor[1], brand, category, color, price, originalPrice, sourceImageUrl })
  }
  return [...new Map(items.map((item) => [item.slug, item])).values()]
}

async function collectBrandCards(brand) {
  const products = new Map()
  for (let page = 1; page <= 5 && products.size < 10; page += 1) {
    const suffix = page === 1 ? '' : `?page=${page}`
    const cards = parseCards(await fetchPublic(`${collections[brand]}${suffix}`), brand)
    for (const card of cards) products.set(card.slug, card)
    if (cards.length === 0) break
  }
  return [...products.values()]
}

function svg(product) {
  const label = `${product.brand} · ${product.category} · ${product.color}`.replace(/[&<>]/g, '')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${label}"><rect width="800" height="600" fill="#e2e8f0"/><rect x="80" y="120" width="640" height="360" rx="32" fill="#ffffff"/><path d="M180 390c115 0 150-115 280-115 80 0 112 55 170 75v55H180z" fill="#64748b"/><text x="400" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#0f172a">${product.brand}</text><text x="400" y="530" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#334155">${product.category} · ${product.color}</text></svg>`
}

const capturedAt = new Date().toISOString()
try {
  if (!force && !dryRun && await (async () => { try { return Boolean((await import('node:fs')).existsSync(output)) } catch { return false } })()) throw new Error('SNAPSHOT_EXISTS Use --force to replace the locked snapshot.')
  const robots = await fetchPublic('/robots.txt')
  if (!robotsAllow(robots, '/collections/giay-dep-nam')) throw new Error('ROBOTS_DISALLOWS_COLLECTION No collection request was made.')
  await fetchPublic('/pages/dieu-khoan-va-dieu-kien')
  const selected = []
  const finalBrands = []
  for (const requestedBrand of ['NIKE', 'ADIDAS', 'NEW_BALANCE', 'CROCS', 'PUMA']) {
    let brand = requestedBrand
    let cards = await collectBrandCards(brand)
    if (brand === 'NEW_BALANCE' && cards.length < 10) {
      brand = 'ASICS'; cards = await collectBrandCards(brand)
      if (cards.length < 10) { brand = 'HOKA'; cards = await collectBrandCards(brand) }
    }
    if (cards.length < 10) throw new Error(`INSUFFICIENT_PUBLIC_PRODUCTS ${brand}: found ${cards.length} eligible cards.`)
    finalBrands.push(brand)
    selected.push(...cards.slice(0, 10))
  }
  if (dryRun) { console.log(JSON.stringify({ finalBrands, selected: selected.length }, null, 2)); process.exit(0) }
  const products = selected.map((item, index) => ({
    id: `ss-${String(index + 1).padStart(3, '0')}`, name: item.name, slug: item.slug, brand: item.brand, category: item.category, color: item.color, price: item.price, originalPrice: item.originalPrice, currency: 'VND', onSale: item.originalPrice !== null && item.originalPrice > item.price,
    description: `${item.name} màu ${item.color}, được dùng làm dữ liệu mẫu có cấu trúc cho website thương mại điện tử trong nghiên cứu framework.`, image: `/images/${item.slug}.svg`, sourceImageUrl: item.sourceImageUrl, sourceUrl: `${origin}/products/${item.slug}`, featured: index < 8, capturedAt,
  }))
  mkdirSync(resolve(dataDir, 'images'), { recursive: true })
  for (const product of products) writeFileSync(resolve(dataDir, product.image.slice(1)), svg(product))
  writeFileSync(output, `${JSON.stringify(products, null, 2)}\n`)
  writeFileSync(resolve(dataDir, 'brands.json'), `${JSON.stringify(finalBrands.map((id) => ({ id, name: id.replace('_', ' ') })), null, 2)}\n`)
  writeFileSync(resolve(dataDir, 'categories.json'), `${JSON.stringify(requiredCategories.map((id) => ({ id })), null, 2)}\n`)
  writeFileSync(resolve(dataDir, 'source-manifest.json'), `${JSON.stringify({ capturedAt, collections: finalBrands.map((brand) => `${origin}${collections[brand]}`), productCount: products.length }, null, 2)}\n`)
  const counts = Object.fromEntries(finalBrands.map((brand) => [brand, products.filter((product) => product.brand === brand).length]))
  const categoryCounts = Object.fromEntries(requiredCategories.map((category) => [category, products.filter((product) => product.category === category).length]))
  writeFileSync(resolve(dataDir, 'source-report.md'), `# Source report\n\n- Collection URLs used: ${finalBrands.map((brand) => `${origin}${collections[brand]}`).join(', ')}\n- Captured at: ${capturedAt}\n- Pages read: ${2 + finalBrands.length} (robots, terms, and collections)\n- Product cards found and selected: ${products.length}\n- Final brands: ${finalBrands.join(', ')}\n- Brand replacement: ${finalBrands.includes('NEW_BALANCE') ? 'None.' : `NEW_BALANCE replaced by ${finalBrands.find((brand) => brand === 'ASICS' || brand === 'HOKA')}.`}\n- Products per brand: ${JSON.stringify(counts)}\n- Products per category: ${JSON.stringify(categoryCounts)}\n- Directly collected fields: name, brand, current price, original price when displayed, product URL, image URL.\n- Derived fields: category and color from the public product-card name; slug from public product URL.\n- Demo fields: id, neutral description, local SVG image path, featured flag.\n- Local SVG rationale: identical local assets are synchronized to both applications for comparable loading conditions; no source product image was copied or downloaded.\n- Access issues: none. robots.txt allowed the collection paths; no login, CAPTCHA, proxy, retry bypass, or non-public endpoint was used.\n`)
  console.log(`Created locked snapshot with ${products.length} products.`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
