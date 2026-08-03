<script setup lang="ts">
import type { CartItem as CartItemType } from '../../stores/cart'
import { formatVnd } from '../../utils/product-presentation'

defineProps<{ item: CartItemType }>()
const emit = defineEmits<{ change: [productId: string, delta: number], remove: [productId: string] }>()
</script>

<template>
  <article class="flex gap-4 border-b border-slate-200 py-4">
    <img :src="item.image" :alt="item.imageAlt" class="h-24 w-28 rounded-md bg-slate-100 object-cover" height="96" width="112">
    <div class="min-w-0 flex-1">
      <NuxtLink :to="`/product/${item.slug}`" class="font-semibold text-slate-950 hover:text-sky-700">{{ item.name }}</NuxtLink>
      <p class="mt-1 text-sm text-slate-600">{{ item.brand }} · {{ formatVnd(item.price) }}</p>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button aria-label="Giảm số lượng" class="rounded border px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="emit('change', item.productId, -1)">−</button>
        <span aria-live="polite" class="min-w-6 text-center">{{ item.quantity }}</span>
        <button aria-label="Tăng số lượng" class="rounded border px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="emit('change', item.productId, 1)">+</button>
        <button class="ml-auto rounded px-2 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="emit('remove', item.productId)">Xóa sản phẩm</button>
      </div>
    </div>
  </article>
</template>
