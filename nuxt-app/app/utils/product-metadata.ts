import type { ProductListItem } from '../../shared/types/product'

export const productPageTitle = (product: ProductListItem): string => `${product.name} | ${product.brand} | Bước Chân Demo`

export const productPageDescription = (product: ProductListItem): string => product.description
