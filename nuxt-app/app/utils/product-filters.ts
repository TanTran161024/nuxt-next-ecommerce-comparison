import type { ProductFilters } from '../../shared/types/product'

export type ProductQuery = Record<string, string | (string | null)[] | null | undefined>

const filterKeys = ['brand', 'category', 'color', 'minPrice', 'maxPrice'] as const

const readQueryValue = (query: ProductQuery, key: string): string | undefined => {
  const value = query[key]
  const scalarValue = Array.isArray(value) ? value[0] : value

  if (typeof scalarValue !== 'string') {
    return undefined
  }

  const trimmedValue = scalarValue.trim()
  return trimmedValue || undefined
}

const readPrice = (query: ProductQuery, key: 'minPrice' | 'maxPrice'): number | undefined => {
  const value = readQueryValue(query, key)

  if (!value) {
    return undefined
  }

  const price = Number(value)
  return Number.isFinite(price) && price >= 0 ? price : undefined
}

export const queryToProductFilters = (query: ProductQuery): ProductFilters => {
  const filters: ProductFilters = {}
  const brand = readQueryValue(query, 'brand')
  const category = readQueryValue(query, 'category')
  const color = readQueryValue(query, 'color')
  const minPrice = readPrice(query, 'minPrice')
  const maxPrice = readPrice(query, 'maxPrice')

  if (brand) filters.brand = brand
  if (category) filters.category = category
  if (color) filters.color = color
  if (minPrice !== undefined) filters.minPrice = minPrice
  if (maxPrice !== undefined) filters.maxPrice = maxPrice

  return filters
}

export const filtersToQuery = (filters: ProductFilters): Record<string, string> => {
  const query: Record<string, string> = {}

  if (filters.brand) query.brand = filters.brand
  if (filters.category) query.category = filters.category
  if (filters.color) query.color = filters.color
  if (filters.minPrice !== undefined) query.minPrice = String(filters.minPrice)
  if (filters.maxPrice !== undefined) query.maxPrice = String(filters.maxPrice)

  return query
}

export const normalizeProductQuery = (query: ProductQuery): Record<string, string> => {
  const filters = queryToProductFilters(query)
  const normalizedQuery = filtersToQuery(filters)

  return filterKeys.reduce<Record<string, string>>((result, key) => {
    const value = normalizedQuery[key]

    if (value) {
      result[key] = value
    }

    return result
  }, {})
}
