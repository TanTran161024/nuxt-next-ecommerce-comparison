'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { CartProduct } from './CartProvider'
import { useCart } from './CartProvider'

export function CartButton({ product }: { product: CartProduct }) {
  const cart = useCart()
  const [added, setAdded] = useState(false)
  const add = (): void => { cart.add(product); setAdded(true); window.setTimeout(() => setAdded(false), 1400) }
  return <button className="m-4 mt-0 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" type="button" onClick={add}>{added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}</button>
}

export function CartLink() {
  const cart = useCart()
  return <Link aria-label="Giỏ hàng" className="relative inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm font-semibold hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" href="/cart"><svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l2.1 10.5a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg><span className="hidden sm:inline">Giỏ hàng</span>{cart.hydrated && cart.count > 0 && <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs text-white">{cart.count}</span>}</Link>
}
