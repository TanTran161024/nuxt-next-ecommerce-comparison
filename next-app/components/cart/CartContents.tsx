'use client'

import Link from 'next/link'
import { CartItem } from './CartItem'
import { useCart } from './CartProvider'

const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export function CartContents() {
  const cart = useCart()
  if (!cart.hydrated) return <p className="mt-6 text-slate-600">Đang khôi phục giỏ hàng…</p>
  if (!cart.items.length) return <div className="mt-6 rounded-xl border bg-white p-6"><p className="font-semibold">Giỏ hàng của bạn đang trống</p><Link className="mt-4 inline-flex rounded bg-slate-950 px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" href="/products">Tiếp tục mua sắm</Link></div>
  return <div className="mt-6 rounded-xl border bg-white p-5">{cart.items.map((item) => <CartItem key={item.productId} item={item}/>)}<p className="mt-6 text-xl font-bold">Tổng tiền: {money(cart.total)}</p><button className="mt-4 rounded bg-slate-950 px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" onClick={cart.clear}>Xóa toàn bộ</button></div>
}
