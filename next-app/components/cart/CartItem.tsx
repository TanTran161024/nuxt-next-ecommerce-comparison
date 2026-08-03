'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CartItem as CartItemType } from './CartProvider'
import { useCart } from './CartProvider'

const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export function CartItem({ item }: { item: CartItemType }) {
  const cart = useCart()
  return <article className="flex gap-4 border-b border-slate-200 py-4"><Image src={item.image} alt={item.imageAlt} width={112} height={96} className="h-24 w-28 rounded-md bg-slate-100 object-cover"/><div className="min-w-0 flex-1"><Link href={`/product/${item.slug}`} className="font-semibold text-slate-950 hover:text-sky-700">{item.name}</Link><p className="mt-1 text-sm text-slate-600">{item.brand} · {money(item.price)}</p><div className="mt-3 flex flex-wrap items-center gap-2"><button aria-label="Giảm số lượng" className="rounded border px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" onClick={() => cart.change(item.productId, -1)}>−</button><span aria-live="polite" className="min-w-6 text-center">{item.quantity}</span><button aria-label="Tăng số lượng" className="rounded border px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" onClick={() => cart.change(item.productId, 1)}>+</button><button className="ml-auto rounded px-2 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" onClick={() => cart.remove(item.productId)}>Xóa sản phẩm</button></div></div></article>
}
