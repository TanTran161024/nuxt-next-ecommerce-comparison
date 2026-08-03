import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { dataDir, readJson, root, sha256 } from './data-utils.mjs'

const pairs = [
  ['nuxt-app/shared/data', 'next-app/data'],
  ['nuxt-app/public/products', 'next-app/public/products'],
]
let valid = true
for (const [left, right] of pairs) {
  const leftPath = resolve(root, left); const rightPath = resolve(root, right)
  const files = readdirSync(leftPath).sort()
  if (!existsSync(rightPath) || JSON.stringify(files) !== JSON.stringify(readdirSync(rightPath).sort())) { valid = false; console.error(`File list differs: ${left} / ${right}`); continue }
  for (const file of files) if (sha256(resolve(leftPath, file)) !== sha256(resolve(rightPath, file))) { valid = false; console.error(`Checksum differs: ${file}`) }
}
const products = readJson(resolve(dataDir, 'products.json'))
for (const directory of ['nuxt-app/public/products', 'next-app/public/products']) if (readdirSync(resolve(root, directory)).length !== products.length) { valid = false; console.error(`Expected ${products.length} images in ${directory}.`) }
if (!valid) process.exitCode = 1; else console.log('Data and images have matching SHA-256 checksums.')
