import { describe, expect, it } from 'vitest'
import { getAllProducts, getProductBySlug, getRelatedProducts } from '../../server/utils/products'
import { productPageDescription, productPageTitle } from '../../app/utils/product-metadata'
import { hasOriginalPrice } from '../../app/utils/product-presentation'

describe('product detail data', () => {
  const product = getAllProducts()[0]

  it('finds a valid slug and rejects a missing slug', () => {
    expect(getProductBySlug(product.slug)).toEqual(product)
    expect(getProductBySlug('missing-product')).toBeUndefined()
  })

  it('builds metadata from the current product, including its brand', () => {
    expect(productPageTitle(product)).toContain(product.name)
    expect(productPageTitle(product)).toContain(product.brand)
    expect(productPageDescription(product)).toBe(product.description)
  })

  it('returns at most four unique related products without the current product', () => {
    const relatedItems = getRelatedProducts(product)
    const relatedIds = relatedItems.map((item) => item.id)

    expect(relatedItems.length).toBeLessThanOrEqual(4)
    expect(relatedIds).not.toContain(product.id)
    expect(new Set(relatedIds).size).toBe(relatedIds.length)
  })

  it('only displays an original price when present and has a source URL', () => {
    expect(hasOriginalPrice(product.originalPrice)).toBe(product.originalPrice !== null)
    expect(product.sourceUrl).toMatch(/^https:\/\//)
  })
})
