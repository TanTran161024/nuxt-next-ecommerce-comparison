<script setup lang="ts">
import type { ProductListItem } from '../../../shared/types/product'
import { formatVnd, hasOriginalPrice } from '../../utils/product-presentation'

defineProps<{
  product: ProductListItem
  categoryLabel: string
}>()
</script>

<template>
  <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <NuxtLink :to="`/product/${product.slug}`" class="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600">
      <img :src="product.image" :alt="product.imageAlt" class="aspect-[4/3] w-full bg-slate-100 object-cover" height="600" width="800">
      <div class="space-y-2 p-4">
        <div class="flex items-start justify-between gap-3">
          <p class="text-xs font-bold tracking-wide text-sky-700">{{ product.brand }}</p>
          <span v-if="product.onSale" class="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">Giảm giá</span>
        </div>
        <h3 class="font-semibold text-slate-950 group-hover:text-sky-700">{{ product.name }}</h3>
        <p class="text-sm text-slate-600">{{ categoryLabel }} · {{ product.color }}</p>
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="font-bold text-slate-950">{{ formatVnd(product.price) }}</span>
          <del v-if="hasOriginalPrice(product.originalPrice)" class="text-sm text-slate-500">{{ formatVnd(product.originalPrice) }}</del>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
