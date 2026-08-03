import { cpSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { dataDir, root } from './data-utils.mjs'

for (const destination of [resolve(root, 'nuxt-app/shared/data'), resolve(root, 'next-app/data')]) {
  mkdirSync(destination, { recursive: true })
  for (const file of ['products.json', 'brands.json', 'categories.json']) cpSync(resolve(dataDir, file), resolve(destination, file))
}
for (const destination of [resolve(root, 'nuxt-app/public/products'), resolve(root, 'next-app/public/products')]) {
  mkdirSync(destination, { recursive: true })
  cpSync(resolve(dataDir, 'images'), destination, { recursive: true })
}
console.log('Data and local SVG assets synchronized.')
