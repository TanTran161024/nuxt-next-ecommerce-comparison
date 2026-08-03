<script setup lang="ts">
import { computed, watch } from 'vue'
import categoriesData from '#shared/data/categories.json'
import type { Category, ProductDetailResponse } from '../../../shared/types/product'
import { hasOriginalPrice, formatVnd } from '../../utils/product-presentation'
import { productPageDescription, productPageTitle } from '../../utils/product-metadata'

const route = useRoute()
const slug = computed(() => (typeof route.params.slug === 'string' ? route.params.slug : ''))
const categories = categoriesData as Category[]

const isNotFoundError = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && 'statusCode' in value && value.statusCode === 404

const { data, error, status, refresh } = await useAsyncData<ProductDetailResponse>(
  () => `product-detail:${slug.value}`,
  () => $fetch(`/api/products/${encodeURIComponent(slug.value)}`),
  { watch: [slug] },
)

if (isNotFoundError(error.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

watch(error, (requestError) => {
  if (isNotFoundError(requestError)) {
    showError(createError({ statusCode: 404, statusMessage: 'Product not found' }))
  }
})

const product = computed(() => data.value?.item)
const relatedItems = computed(() => data.value?.relatedItems ?? [])
const categoryLabel = computed(
  () => categories.find((category) => category.value === product.value?.category)?.label ?? product.value?.category ?? '',
)

useSeoMeta({
  title: () => (product.value ? productPageTitle(product.value) : 'Sản phẩm | Bước Chân Demo'),
  description: () => (product.value ? productPageDescription(product.value) : 'Thông tin sản phẩm giày dép demo.'),
  ogTitle: () => (product.value ? productPageTitle(product.value) : 'Sản phẩm | Bước Chân Demo'),
  ogDescription: () => (product.value ? productPageDescription(product.value) : 'Thông tin sản phẩm giày dép demo.'),
  ogImage: () => product.value?.image,
})

const retry = (): void => {
  void refresh()
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <ProductGridSkeleton v-if="status === 'pending'" />

    <section v-else-if="error" class="rounded-xl border border-rose-200 bg-rose-50 p-6" aria-labelledby="product-error-title">
      <h1 id="product-error-title" class="text-xl font-bold text-rose-900">Không thể tải sản phẩm</h1>
      <p class="mt-2 text-sm text-rose-800">Vui lòng thử lại sau.</p>
      <button class="mt-4 rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="retry">Thử lại</button>
    </section>

    <template v-else-if="product">
      <div class="grid gap-8 lg:grid-cols-2 lg:items-start">
        <img :src="product.image" :alt="product.imageAlt" class="aspect-[4/3] w-full rounded-xl bg-slate-100 object-cover" height="600" width="800">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">{{ product.brand }}</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{{ product.name }}</h1>
          <p class="mt-3 text-slate-600">{{ categoryLabel }} · {{ product.color }}</p>
          <div class="mt-6 flex flex-wrap items-baseline gap-3">
            <span class="text-2xl font-bold text-slate-950">{{ formatVnd(product.price) }}</span>
            <del v-if="hasOriginalPrice(product.originalPrice)" class="text-slate-500">{{ formatVnd(product.originalPrice) }}</del>
            <span v-if="product.onSale" class="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">Đang giảm giá</span>
          </div>
          <p class="mt-7 leading-7 text-slate-700">{{ product.description }}</p>
        </div>
      </div>

      <section v-if="relatedItems.length" class="mt-14" aria-labelledby="related-products-title">
        <h2 id="related-products-title" class="text-2xl font-bold tracking-tight text-slate-950">Sản phẩm liên quan</h2>
        <ProductGrid :categories="categories" :products="relatedItems" class="mt-6" />
      </section>

      <section class="mt-14 rounded-xl border border-slate-200 bg-white p-5" aria-labelledby="source-title">
        <h2 id="source-title" class="text-base font-bold text-slate-950">Nguồn dữ liệu hình ảnh và sản phẩm</h2>
        <p class="mt-2 text-sm text-slate-600">Thông tin nguồn được lưu cùng snapshot dữ liệu dùng cho nghiên cứu.</p>
        <a :href="product.sourceUrl" class="mt-3 inline-flex rounded text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600" rel="noopener noreferrer" target="_blank">Xem nguồn dữ liệu</a>
      </section>
    </template>
  </section>
</template>
