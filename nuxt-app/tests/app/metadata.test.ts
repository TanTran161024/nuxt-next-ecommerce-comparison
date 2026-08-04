import { describe, expect, it } from 'vitest'
import { getAllProducts, getProductBySlug } from '../../server/utils/products'
import {
  homePageMetadata,
  productNotFoundPageDescription,
  productNotFoundPageTitle,
  productPageDescription,
  productPageTitle,
  productsPageMetadata,
} from '../../app/utils/product-metadata'

describe('page metadata', () => {
  const product = getAllProducts()[0]

  it('uses product-list metadata distinct from the homepage', () => {
    expect(homePageMetadata.title).toContain('Bước Chân Demo')
    expect(productsPageMetadata.title).toContain('Sản phẩm')
    expect(productsPageMetadata.description).toContain('Danh sách')
    expect(productsPageMetadata).not.toEqual(homePageMetadata)
  })

  it('uses the valid product name in detail metadata', () => {
    expect(productPageTitle(product)).toContain(product.name)
    expect(productPageDescription(product)).toBe(product.description)
  })

  it('uses 404 metadata rather than valid-product metadata for a missing slug', () => {
    expect(getProductBySlug('missing-product')).toBeUndefined()
    expect(productNotFoundPageTitle).toContain('Không tìm thấy')
    expect(productNotFoundPageDescription).toContain('không tồn tại')
    expect(productNotFoundPageTitle).not.toContain(product.name)
    expect(productNotFoundPageDescription).not.toBe(productPageDescription(product))
  })
})
