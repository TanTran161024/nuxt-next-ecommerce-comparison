import { describe, expect, it } from 'vitest'
import { getAllProducts, getProductBySlug } from '../../lib/products'
import { GET as getProductDetail } from '../../app/api/products/[slug]/route'
import {
  homeMetadata,
  productMetadata,
  productNotFoundMetadata,
  productsPageMetadata,
} from '../../lib/metadata'

describe('page metadata', () => {
  const product = getAllProducts()[0]

  it('keeps homepage and product-list metadata distinct', () => {
    expect(homeMetadata.title).toContain('Bước Chân Demo')
    expect(productsPageMetadata.title).toContain('Sản phẩm')
    expect(productsPageMetadata.description).toContain('Danh sách')
    expect(productsPageMetadata).not.toEqual(homeMetadata)
  })

  it('uses the valid product name in detail metadata', () => {
    const metadata = productMetadata(product)
    expect(metadata.title).toContain(product.name)
    expect(metadata.description).toBe(product.description)
  })

  it('keeps 404 metadata separate when a slug is missing', () => {
    expect(getProductBySlug('missing-product')).toBeUndefined()
    expect(productNotFoundMetadata.title).toContain('Không tìm thấy')
    expect(productNotFoundMetadata.description).toContain('không tồn tại')
    expect(productNotFoundMetadata.title).not.toContain(product.name)
    expect(productNotFoundMetadata.description).not.toBe(product.description)
  })

  it('returns HTTP 404 from the product API for a missing slug', async () => {
    const response = await getProductDetail({} as never, {
      params: Promise.resolve({ slug: 'missing-product' }),
    })

    expect(response.status).toBe(404)
  })
})
