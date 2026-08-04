import type { Metadata } from 'next'
import type { Product } from '../types/product'

export const homeMetadata: Metadata = {
  title: 'Bước Chân Demo | Giày dép phục vụ nghiên cứu',
  description: 'Website giày dép demo phục vụ nghiên cứu so sánh Nuxt và Next.js.',
}

export const productsPageMetadata: Metadata = {
  title: 'Sản phẩm | Bước Chân Demo',
  description: 'Danh sách giày dép demo với bộ lọc thương hiệu, loại, màu sắc và giá.',
}

export const productNotFoundMetadata: Metadata = {
  title: 'Không tìm thấy sản phẩm | Bước Chân Demo',
  description: 'Sản phẩm bạn tìm không tồn tại hoặc đã được thay đổi.',
}

export const productMetadata = (product: Product): Metadata => ({
  title: `${product.name} | ${product.brand} | Bước Chân Demo`,
  description: product.description,
  openGraph: {
    title: `${product.name} | ${product.brand}`,
    description: product.description,
    images: [product.image],
  },
})
