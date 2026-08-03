import { describe, expect, it } from 'vitest'
import fixture from '../../../shared-data/cart-test-fixture.json'
import { cartReducer, initialCartState, parseCartStorage } from '../../components/cart/CartProvider'

describe('cart contract', () => {
  it('adds, increments, and totals the shared fixture product', () => {
    const items = cartReducer(cartReducer([], { type: 'add', product: fixture.product }), { type: 'add', product: fixture.product })
    expect(items).toEqual([{ ...fixture.product, quantity: 2 }])
    expect(items.reduce((total, item) => total + item.quantity, 0)).toBe(2)
    expect(items.reduce((total, item) => total + item.price * item.quantity, 0)).toBe(fixture.expectedTotal)
  })

  it('changes quantity without falling below one, removes, and clears', () => {
    const added = cartReducer([], { type: 'add', product: fixture.product })
    const increased = cartReducer(added, { type: 'change', productId: fixture.product.productId, delta: 1 })
    expect(increased[0]?.quantity).toBe(2)
    const minimum = cartReducer(increased, { type: 'change', productId: fixture.product.productId, delta: -3 })
    expect(minimum[0]?.quantity).toBe(1)
    expect(cartReducer(minimum, { type: 'remove', productId: fixture.product.productId })).toEqual([])
    expect(cartReducer(added, { type: 'clear' })).toEqual([])
  })

  it('restores only valid localStorage data', () => {
    expect(initialCartState.hydrated).toBe(false)
    expect(parseCartStorage(JSON.stringify([{ ...fixture.product, quantity: 2 }]))).toEqual([{ ...fixture.product, quantity: 2 }])
    expect(parseCartStorage('{not-json')).toEqual([])
    expect(parseCartStorage(JSON.stringify([{ productId: fixture.product.productId }]))).toEqual([])
  })
})
