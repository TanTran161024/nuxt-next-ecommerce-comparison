import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProductStore } from '../../app/stores/product'
import {
  filtersToQuery,
  normalizeProductQuery,
  queryToProductFilters,
} from '../../app/utils/product-filters'
import { formatVnd, hasOriginalPrice } from '../../app/utils/product-presentation'

describe('product filter URL helpers', () => {
  it('normalizes supported URL query values', () => {
    expect(
      normalizeProductQuery({
        brand: ' NIKE ',
        category: ['running-shoes', 'slides'],
        color: ' Đen ',
        minPrice: '2000000',
        maxPrice: '-1',
        ignored: 'value',
      }),
    ).toEqual({
      brand: 'NIKE',
      category: 'running-shoes',
      color: 'Đen',
      minPrice: '2000000',
    })
  })

  it('converts a URL query to product filters', () => {
    expect(
      queryToProductFilters({
        brand: 'ADIDAS',
        category: 'slides',
        color: 'Trắng',
        minPrice: '1000000',
        maxPrice: '3000000',
      }),
    ).toEqual({
      brand: 'ADIDAS',
      category: 'slides',
      color: 'Trắng',
      minPrice: 1_000_000,
      maxPrice: 3_000_000,
    })
  })

  it('converts active filters back to URL query values', () => {
    expect(filtersToQuery({ brand: 'PUMA', minPrice: 2_500_000 })).toEqual({
      brand: 'PUMA',
      minPrice: '2500000',
    })
  })
})

describe('product presentation helpers', () => {
  it('formats VND values and only marks a present original price for display', () => {
    expect(formatVnd(2_899_000)).toContain('2.899.000')
    expect(hasOriginalPrice(null)).toBe(false)
    expect(hasOriginalPrice(3_199_000)).toBe(true)
  })
})

describe('product Pinia store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates, restores, and resets filters', () => {
    const store = useProductStore()

    store.setFilters({ brand: 'NIKE', color: 'Đen' })
    expect(store.filters).toEqual({ brand: 'NIKE', color: 'Đen' })

    store.restoreFiltersFromQuery({ category: 'clogs', minPrice: '1500000' })
    expect(store.filters).toEqual({ category: 'clogs', minPrice: 1_500_000 })

    store.resetFilters()
    expect(store.filters).toEqual({})
  })
})
