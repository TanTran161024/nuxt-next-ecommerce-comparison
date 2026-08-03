import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { allowedBrands, dataDir, requiredCategories } from './data-utils.mjs'

const [header, ...rows] = readFileSync(resolve(dataDir, 'manual-products-template.csv'), 'utf8').trim().split(/\r?\n/)
const expected = ['name', 'brand', 'category', 'color', 'price', 'originalPrice', 'sourceUrl', 'sourceImageUrl']
const fields = header.split(','); const errors = []
if (JSON.stringify(fields) !== JSON.stringify(expected)) errors.push('CSV headers do not match the required contract.')
const records = rows.filter(Boolean).map((row) => Object.fromEntries(row.split(',').map((value, index) => [fields[index], value.trim()])))
if (records.length !== 50) errors.push(`Expected 50 CSV rows, found ${records.length}.`)
const names = new Set(); const counts = new Map()
for (const record of records) { counts.set(record.brand, (counts.get(record.brand) ?? 0) + 1); if (!record.name || !record.color || !record.sourceImageUrl) errors.push(`Missing required CSV field: ${record.name || '(unnamed)'}`); if (names.has(record.name)) errors.push(`Duplicate name: ${record.name}`); names.add(record.name); if (!allowedBrands.includes(record.brand)) errors.push(`Invalid brand: ${record.brand}`); if (!requiredCategories.includes(record.category)) errors.push(`Invalid category: ${record.category}`); if (!Number.isInteger(Number(record.price)) || Number(record.price) <= 0) errors.push(`Invalid price: ${record.name}`) }
for (const brand of allowedBrands) if (counts.get(brand) !== 10) errors.push(`${brand} requires 10 CSV products.`)
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 } else console.log('Manual CSV validation passed.')
