import { describe, expect, it } from 'vitest'
import {
  ProductFilterValidationError,
  filterProducts,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  parseProductFilters,
} from '../../server/utils/products'

describe('shared product data', () => {
  const allProducts = getAllProducts()

  it('contains exactly 50 products and 10 products per brand', () => {
    expect(allProducts).toHaveLength(50)

    for (const brand of ['NIKE', 'ADIDAS', 'NEW_BALANCE', 'CROCS', 'PUMA']) {
      expect(allProducts.filter((product) => product.brand === brand)).toHaveLength(10)
    }
  })
})

describe('product filtering', () => {
  it('returns all products without filters and after resetting filters', () => {
    expect(getAllProducts()).toHaveLength(50)
    expect(filterProducts()).toEqual(getAllProducts())
  })

  it('filters each brand', () => {
    for (const brand of ['NIKE', 'ADIDAS', 'NEW_BALANCE', 'CROCS', 'PUMA']) {
      const items = filterProducts({ brand })
      expect(items).toHaveLength(10)
      expect(items.every((product) => product.brand === brand)).toBe(true)
    }
  })

  it('filters a category, a color, and a price range', () => {
    const categoryItems = filterProducts({ category: 'running-shoes' })
    const color = getAllProducts()[0].color
    const colorItems = filterProducts({ color })
    const priceItems = filterProducts({ minPrice: 2_000_000, maxPrice: 3_000_000 })

    expect(categoryItems).toHaveLength(12)
    expect(categoryItems.every((product) => product.category === 'running-shoes')).toBe(true)
    expect(colorItems.length).toBeGreaterThan(0)
    expect(colorItems.every((product) => product.color === color)).toBe(true)
    expect(priceItems.length).toBeGreaterThan(0)
    expect(priceItems.every((product) => product.price >= 2_000_000 && product.price <= 3_000_000)).toBe(true)
  })

  it('combines brand, category, color, and price filters', () => {
    const reference = getAllProducts()[0]
    const brandAndCategory = filterProducts({
      brand: reference.brand,
      category: reference.category,
    })
    const combined = filterProducts({
      brand: reference.brand,
      category: reference.category,
      color: reference.color,
      minPrice: reference.price,
      maxPrice: reference.price,
    })

    expect(brandAndCategory.length).toBeGreaterThan(0)
    expect(brandAndCategory.every((product) => product.brand === reference.brand && product.category === reference.category)).toBe(true)
    expect(combined).toContainEqual(reference)
    expect(combined.every((product) => product.brand === reference.brand && product.category === reference.category && product.color === reference.color && product.price === reference.price)).toBe(true)
  })

  it('returns an empty list for valid filters without matching products', () => {
    expect(filterProducts({ maxPrice: 0 })).toEqual([])
  })
})

describe('product filter validation', () => {
  it('normalizes valid text filters without case or surrounding whitespace', () => {
    expect(parseProductFilters({ brand: ' nike ', category: ' RUNNING-SHOES ' })).toEqual({
      brand: 'NIKE',
      category: 'running-shoes',
    })
  })

  it('rejects invalid brand, category, color, and price filters', () => {
    expect(() => parseProductFilters({ brand: 'OTHER' })).toThrow(ProductFilterValidationError)
    expect(() => parseProductFilters({ category: 'boots' })).toThrow(ProductFilterValidationError)
    expect(() => parseProductFilters({ color: 'camouflage' })).toThrow(ProductFilterValidationError)
    expect(() => parseProductFilters({ minPrice: '-1' })).toThrow(ProductFilterValidationError)
    expect(() => parseProductFilters({ maxPrice: 'not-a-number' })).toThrow(ProductFilterValidationError)
  })

  it('rejects a minimum price that exceeds the maximum price', () => {
    expect(() => parseProductFilters({ minPrice: '3000000', maxPrice: '2000000' })).toThrow(
      ProductFilterValidationError,
    )
  })
})

describe('product details and related products', () => {
  it('finds a valid slug and returns undefined for a missing slug', () => {
    const product = getAllProducts()[0]

    expect(getProductBySlug(product.slug)).toEqual(product)
    expect(getProductBySlug('does-not-exist')).toBeUndefined()
  })

  it('does not include the current product or duplicates in related products', () => {
    const product = getAllProducts()[0]
    const relatedItems = getRelatedProducts(product)
    const relatedIds = relatedItems.map((item) => item.id)

    expect(relatedItems).toHaveLength(4)
    expect(relatedIds).not.toContain(product.id)
    expect(new Set(relatedIds).size).toBe(relatedIds.length)
    expect(relatedItems.filter((item) => item.category === product.category).length).toBeGreaterThan(0)
  })
})
