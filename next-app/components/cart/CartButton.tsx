'use client'

import Link from 'next/link'
import type { CartProduct } from './CartProvider'
import { useCart } from './CartProvider'

export function CartButton({ product }: { product: CartProduct }) {
  const cart = useCart()
  return <button className="m-4 rounded bg-slate-950 px-3 py-2 text-sm text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" onClick={() => cart.add(product)}>Thêm vào giỏ</button>
}

export function CartLink() {
  const cart = useCart()
  return <Link href="/cart">Giỏ hàng{cart.hydrated ? ` (${cart.count})` : ''}</Link>
}
