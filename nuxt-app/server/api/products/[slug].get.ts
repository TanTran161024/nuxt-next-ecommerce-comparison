import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { Product, ProductListItem } from '../../../shared/types/product'
import { getProductBySlug, getRelatedProducts } from '../../utils/products'

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

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const product = slug ? getProductBySlug(slug) : undefined

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return {
    item: toProductListItem(product),
    relatedItems: getRelatedProducts(product).map(toProductListItem),
  }
})
