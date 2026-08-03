import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import fixture from '../../../shared-data/cart-test-fixture.json'
import { parseCartStorage, useCartStore } from '../../app/stores/cart'

describe('cart contract', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('adds, increments, and totals the shared fixture product', () => {
    const cart = useCartStore()
    cart.add(fixture.product)
    cart.add(fixture.product)
    expect(cart.items).toEqual([{ ...fixture.product, quantity: 2 }])
    expect(cart.count).toBe(2)
    expect(cart.total).toBe(fixture.expectedTotal)
  })

  it('changes quantity without falling below one, removes, and clears', () => {
    const cart = useCartStore()
    cart.add(fixture.product)
    cart.change(fixture.product.productId, 1)
    expect(cart.items[0]?.quantity).toBe(2)
    cart.change(fixture.product.productId, -3)
    expect(cart.items[0]?.quantity).toBe(1)
    cart.remove(fixture.product.productId)
    expect(cart.items).toEqual([])
    cart.add(fixture.product)
    cart.clear()
    expect(cart.items).toEqual([])
  })

  it('restores only valid localStorage data and begins unhydrated for SSR safety', () => {
    expect(useCartStore().hydrated).toBe(false)
    expect(parseCartStorage(JSON.stringify([{ ...fixture.product, quantity: 2 }]))).toEqual([{ ...fixture.product, quantity: 2 }])
    expect(parseCartStorage('{not-json')).toEqual([])
    expect(parseCartStorage(JSON.stringify([{ productId: fixture.product.productId }]))).toEqual([])
  })
})
