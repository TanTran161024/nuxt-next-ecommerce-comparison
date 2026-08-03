import { createError, defineEventHandler, getQuery } from 'h3'
import type { Product, ProductListItem, ProductListResponse } from '../../../shared/types/product'
import {
  ProductFilterValidationError,
  filterProducts,
  getAvailableFilters,
  parseProductFilters,
} from '../../utils/products'

const toProductListItem = (product: Product): ProductListItem => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  brand: product.brand,
  category: product.category,
  color: product.color,
  price: product.price,
  originalPrice: product.originalPrice,
  currency: product.currency,
  onSale: product.onSale,
  description: product.description,
  image: product.image,
  imageAlt: product.imageAlt,
  sourceUrl: product.sourceUrl,
  featured: product.featured,
})

export default defineEventHandler((event): ProductListResponse => {
  let appliedFilters

  try {
    appliedFilters = parseProductFilters(getQuery(event))
  } catch (error: unknown) {
    if (error instanceof ProductFilterValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product filters',
        data: {
          message: error.message,
        },
      })
    }

    throw error
  }

  const availableFilters = getAvailableFilters()
  const items = filterProducts(appliedFilters).map(toProductListItem)

  return {
    items,
    total: items.length,
    appliedFilters,
    availableBrands: availableFilters.brands,
    availableCategories: availableFilters.categories,
    availableColors: availableFilters.colors,
    priceRange: availableFilters.priceRange,
  }
})
