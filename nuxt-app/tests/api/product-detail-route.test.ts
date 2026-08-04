import { describe, expect, it } from 'vitest'
import productDetailHandler from '../../server/api/products/[slug].get'

describe('product detail API route', () => {
  it('returns a 404 error for a missing slug', () => {
    try {
      productDetailHandler({ context: { params: { slug: 'missing-product' } } } as never)
      throw new Error('Expected the product detail route to throw a 404 error.')
    } catch (error: unknown) {
      expect(error).toMatchObject({ statusCode: 404, statusMessage: 'Product not found' })
    }
  })
})
