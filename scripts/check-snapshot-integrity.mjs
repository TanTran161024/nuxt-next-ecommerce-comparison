import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { assertSnapshot, dataDir, readJson, root, sha256 } from './data-utils.mjs'

const canonicalProductsPath = resolve(dataDir, 'products.json')
const canonicalProducts = readJson(canonicalProductsPath)
const applicationSnapshots = [
  ['Nuxt', resolve(root, 'nuxt-app/shared/data/products.json'), resolve(root, 'nuxt-app/public')],
  ['Next', resolve(root, 'next-app/data/products.json'), resolve(root, 'next-app/public')],
]

assertSnapshot(canonicalProducts)

for (const [name, snapshotPath, publicPath] of applicationSnapshots) {
  assert.ok(existsSync(snapshotPath), `${name}: missing product snapshot at ${snapshotPath}`)
  assert.equal(
    sha256(snapshotPath),
    sha256(canonicalProductsPath),
    `${name}: products.json must match shared-data/products.json byte-for-byte`,
  )

  const products = readJson(snapshotPath)
  assert.deepEqual(products, canonicalProducts, `${name}: product records differ from the shared snapshot`)

  for (const product of products) {
    const sourceImage = resolve(dataDir, 'images/benchmark', basename(product.image))
    const appImage = resolve(publicPath, product.image.slice(1))
    assert.ok(existsSync(appImage), `${name}: missing image for ${product.slug}: ${product.image}`)
    assert.equal(sha256(appImage), sha256(sourceImage), `${name}: image differs for ${product.slug}`)
  }

  console.log(`${name}: ${products.length} products, ${products.length} product images, matching shared snapshot.`)
}

console.log('Snapshot integrity check passed.')
