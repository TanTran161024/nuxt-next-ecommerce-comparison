import type { ProductListItem } from '../../shared/types/product'

export const homePageMetadata = {
  title: 'Bước Chân Demo | Giày dép phục vụ nghiên cứu',
  description: 'Website giày dép demo phục vụ nghiên cứu so sánh Nuxt và Next.js.',
  ogTitle: 'Bước Chân Demo',
  ogDescription: 'Khám phá danh sách giày dép demo cho nghiên cứu framework web.',
  ogType: 'website' as const,
}

export const productsPageMetadata = {
  title: 'Sản phẩm | Bước Chân Demo',
  description: 'Danh sách giày dép demo với bộ lọc thương hiệu, loại, màu sắc và giá.',
}

export const productPageTitle = (product: ProductListItem): string => `${product.name} | ${product.brand} | Bước Chân Demo`

export const productPageDescription = (product: ProductListItem): string => product.description

export const productNotFoundPageTitle = 'Không tìm thấy sản phẩm | Bước Chân Demo'

export const productNotFoundPageDescription = 'Sản phẩm bạn tìm không tồn tại hoặc đã được thay đổi.'
