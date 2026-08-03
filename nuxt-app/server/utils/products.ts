import brandsData from '../../shared/data/brands.json'
import categoriesData from '../../shared/data/categories.json'
import productsData from '../../shared/data/products.json'
import type {
  Brand,
  Category,
  Product,
  ProductFilters,
} from '../../shared/types/product'

const products = productsData as Product[]
const brands: readonly Brand[] = brandsData
const categories: readonly Category[] = categoriesData

const normalizeText = (value: string): string => value.trim().toLocaleLowerCase('vi-VN')

const uniqueInOrder = (values: readonly string[]): string[] => [...new Set(values)]

export class ProductFilterValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductFilterValidationError'
  }
}

export interface AvailableFilters {
  brands: Brand[]
  categories: Category[]
  colors: string[]
  priceRange: {
    min: number
    max: number
  }
}

export const getAllProducts = (): Product[] => [...products]

export const getProductBySlug = (slug: string): Product | undefined => {
  const normalizedSlug = slug.trim()
  return products.find((product) => product.slug === normalizedSlug)
}

export const filterProducts = (filters: ProductFilters = {}): Product[] =>
  products.filter((product) => {
    const matchesBrand = !filters.brand || normalizeText(product.brand) === normalizeText(filters.brand)
    const matchesCategory = !filters.category || normalizeText(product.category) === normalizeText(filters.category)
    const matchesColor = !filters.color || normalizeText(product.color) === normalizeText(filters.color)
    const matchesMinPrice = filters.minPrice === undefined || product.price >= filters.minPrice
    const matchesMaxPrice = filters.maxPrice === undefined || product.price <= filters.maxPrice

    return matchesBrand && matchesCategory && matchesColor && matchesMinPrice && matchesMaxPrice
  })

export const getRelatedProducts = (product: Product, limit = 4): Product[] => {
  const maximum = Math.min(Math.max(limit, 0), 4)
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  )
  const sameBrand = products.filter(
    (candidate) => candidate.id !== product.id && candidate.brand === product.brand,
  )
  const related = uniqueInOrder([...sameCategory, ...sameBrand].map((candidate) => candidate.id))
    .map((id) => products.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Product => candidate !== undefined)

  return related.slice(0, maximum)
}

export const getAvailableFilters = (): AvailableFilters => {
  const prices = products.map((product) => product.price)

  return {
    brands: brands.map((brand) => ({ ...brand })),
    categories: categories.map((category) => ({ ...category })),
    colors: uniqueInOrder(products.map((product) => product.color)),
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
  }
}

const readQueryValue = (query: Record<string, unknown>, field: string): string | undefined => {
  const value = query[field]

  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    throw new ProductFilterValidationError(`Query parameter "${field}" must be a single value.`)
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new ProductFilterValidationError(`Query parameter "${field}" cannot be empty.`)
  }

  return trimmedValue
}

const normalizeAllowedValue = (value: string, allowedValues: readonly string[], field: string): string => {
  const normalizedValue = normalizeText(value)
  const matchedValue = allowedValues.find((allowedValue) => normalizeText(allowedValue) === normalizedValue)

  if (!matchedValue) {
    throw new ProductFilterValidationError(`Query parameter "${field}" is not allowed.`)
  }

  return matchedValue
}

const parseNonNegativePrice = (value: string, field: string): number => {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new ProductFilterValidationError(`Query parameter "${field}" must be a non-negative number.`)
  }

  return parsedValue
}

export const parseProductFilters = (query: Record<string, unknown>): ProductFilters => {
  const availableFilters = getAvailableFilters()
  const brand = readQueryValue(query, 'brand')
  const category = readQueryValue(query, 'category')
  const color = readQueryValue(query, 'color')
  const minPrice = readQueryValue(query, 'minPrice')
  const maxPrice = readQueryValue(query, 'maxPrice')
  const parsedFilters: ProductFilters = {}

  if (brand) {
    parsedFilters.brand = normalizeAllowedValue(
      brand,
      availableFilters.brands.map((item) => item.value),
      'brand',
    )
  }

  if (category) {
    parsedFilters.category = normalizeAllowedValue(
      category,
      availableFilters.categories.map((item) => item.value),
      'category',
    )
  }

  if (color) {
    parsedFilters.color = normalizeAllowedValue(color, availableFilters.colors, 'color')
  }

  if (minPrice) {
    parsedFilters.minPrice = parseNonNegativePrice(minPrice, 'minPrice')
  }

  if (maxPrice) {
    parsedFilters.maxPrice = parseNonNegativePrice(maxPrice, 'maxPrice')
  }

  if (
    parsedFilters.minPrice !== undefined &&
    parsedFilters.maxPrice !== undefined &&
    parsedFilters.minPrice > parsedFilters.maxPrice
  ) {
    throw new ProductFilterValidationError('Query parameter "minPrice" cannot be greater than "maxPrice".')
  }

  return parsedFilters
}
