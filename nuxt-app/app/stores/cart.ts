import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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

export const cartStorageKey = 'ecommerce-demo-cart'

export const parseCartStorage = (raw: string | null): CartItem[] => {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null && typeof item.productId === 'string' && typeof item.slug === 'string' && typeof item.name === 'string' && typeof item.brand === 'string' && typeof item.image === 'string' && typeof item.imageAlt === 'string' && typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0 && typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity >= 1) ? value as CartItem[] : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const hydrated = ref(false)
  const count = computed(() => items.value.reduce((quantity, item) => quantity + item.quantity, 0))
  const total = computed(() => items.value.reduce((value, item) => value + item.price * item.quantity, 0))
  const save = (): void => { if (import.meta.client) localStorage.setItem(cartStorageKey, JSON.stringify(items.value)) }
  const add = (product: Omit<CartItem, 'quantity'>): void => { const item = items.value.find((candidate) => candidate.productId === product.productId); if (item) item.quantity += 1; else items.value.push({ ...product, quantity: 1 }); save() }
  const change = (productId: string, delta: number): void => { const item = items.value.find((candidate) => candidate.productId === productId); if (item) item.quantity = Math.max(1, item.quantity + delta); save() }
  const remove = (productId: string): void => { items.value = items.value.filter((item) => item.productId !== productId); save() }
  const clear = (): void => { items.value = []; save() }
  const hydrate = (): void => { if (!import.meta.client || hydrated.value) return; items.value = parseCartStorage(localStorage.getItem(cartStorageKey)); hydrated.value = true }
  return { items, hydrated, count, total, add, change, remove, clear, hydrate }
})
