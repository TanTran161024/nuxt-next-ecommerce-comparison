'use client'

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'

export interface CartItem {
  productId: string
  slug: string
  name: string
  brand: string
  image: string
  imageAlt: string
  price: number
  quantity: number
}

export type CartProduct = Omit<CartItem, 'quantity'>
export const cartStorageKey = 'ecommerce-demo-cart'

type CartAction =
  | { type: 'add', product: CartProduct }
  | { type: 'change', productId: string, delta: number }
  | { type: 'remove', productId: string }
  | { type: 'clear' }
  | { type: 'restore', items: CartItem[] }

type CartContextValue = {
  items: CartItem[]
  hydrated: boolean
  count: number
  total: number
  add: (product: CartProduct) => void
  change: (productId: string, delta: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const parseCartStorage = (raw: string | null): CartItem[] => {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null && typeof item.productId === 'string' && typeof item.slug === 'string' && typeof item.name === 'string' && typeof item.brand === 'string' && typeof item.image === 'string' && typeof item.imageAlt === 'string' && typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0 && typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity >= 1) ? value as CartItem[] : []
  } catch {
    return []
  }
}

export const cartReducer = (items: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'add': {
      const existing = items.find((item) => item.productId === action.product.productId)
      return existing ? items.map((item) => item.productId === action.product.productId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...action.product, quantity: 1 }]
    }
    case 'change': return items.map((item) => item.productId === action.productId ? { ...item, quantity: Math.max(1, item.quantity + action.delta) } : item)
    case 'remove': return items.filter((item) => item.productId !== action.productId)
    case 'clear': return []
    case 'restore': return action.items
  }
}

type CartState = { items: CartItem[], hydrated: boolean }
export const initialCartState: CartState = { items: [], hydrated: false }
const cartStateReducer = (state: CartState, action: CartAction): CartState => ({
  items: cartReducer(state.items, action),
  hydrated: state.hydrated || action.type === 'restore',
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartStateReducer, initialCartState)
  useEffect(() => { dispatch({ type: 'restore', items: parseCartStorage(window.localStorage.getItem(cartStorageKey)) }) }, [])
  useEffect(() => { if (state.hydrated) window.localStorage.setItem(cartStorageKey, JSON.stringify(state.items)) }, [state])
  const value: CartContextValue = { items: state.items, hydrated: state.hydrated, count: state.items.reduce((total, item) => total + item.quantity, 0), total: state.items.reduce((total, item) => total + item.price * item.quantity, 0), add: (product) => dispatch({ type: 'add', product }), change: (productId, delta) => dispatch({ type: 'change', productId, delta }), remove: (productId) => dispatch({ type: 'remove', productId }), clear: () => dispatch({ type: 'clear' }) }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
