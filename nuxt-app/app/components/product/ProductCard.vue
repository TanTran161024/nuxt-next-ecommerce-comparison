<script setup lang="ts">
import { ref } from 'vue'
import type { ProductListItem } from '../../../shared/types/product'
import { formatVnd, hasOriginalPrice } from '../../utils/product-presentation'
import { useCartStore } from '../../stores/cart'

const props = defineProps<{ product: ProductListItem, categoryLabel: string }>()
const cart = useCartStore()
const added = ref(false)
let feedbackTimer: ReturnType<typeof setTimeout> | undefined
const addToCart = (): void => { const product = props.product; cart.add({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand, image: product.image, imageAlt: product.imageAlt, price: product.price }); added.value = true; if (feedbackTimer) clearTimeout(feedbackTimer); feedbackTimer = setTimeout(() => { added.value = false }, 1400) }
</script>

<template><article class="flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><NuxtLink :to="`/product/${product.slug}`" class="group flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"><img :src="product.image" :alt="product.imageAlt" class="aspect-[4/3] w-full bg-[var(--color-surface-muted)] object-cover" height="600" width="800"><div class="flex flex-1 flex-col space-y-2 p-4"><div class="flex items-start justify-between gap-3 text-xs font-bold text-[var(--color-primary)]"><span>{{ product.brand }}</span><span v-if="product.onSale" class="rounded-full bg-amber-100 px-2 py-1 text-[var(--color-sale)]">Giảm giá</span></div><h3 class="line-clamp-2 min-h-12 font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">{{ product.name }}</h3><p class="text-sm text-[var(--color-text-muted)]"><span class="rounded-full bg-[var(--color-surface-muted)] px-2 py-1 text-xs">{{ categoryLabel }}</span><span class="ml-1">{{ product.color }}</span></p><div class="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1"><span class="font-bold text-[var(--color-text)]">{{ formatVnd(product.price) }}</span><del v-if="hasOriginalPrice(product.originalPrice)" class="text-sm text-[var(--color-text-muted)]">{{ formatVnd(product.originalPrice) }}</del></div></div></NuxtLink><button class="m-4 mt-0 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]" type="button" @click="addToCart">{{ added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ' }}</button></article></template>
