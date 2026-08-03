<script setup lang="ts">
import { computed } from 'vue'
import type { ProductListResponse } from '../../shared/types/product'

useSeoMeta({
  title: 'Bước Chân Demo | Giày dép phục vụ nghiên cứu',
  description: 'Website giày dép demo phục vụ nghiên cứu so sánh Nuxt và Next.js.',
  ogTitle: 'Bước Chân Demo',
  ogDescription: 'Khám phá danh sách giày dép demo cho nghiên cứu framework web.',
  ogType: 'website',
})

const { data, error } = await useAsyncData('home-products', () =>
  $fetch<ProductListResponse>('/api/products'),
)

const featuredProducts = computed(() => data.value?.items.filter((product) => product.featured) ?? [])
const brands = computed(() => data.value?.availableBrands ?? [])
const categories = computed(() => data.value?.availableCategories ?? [])
</script>

<template>
  <div>
    <section class="bg-slate-950 text-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Nuxt 4.5.1 demo</p>
        <h1 class="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Giày dép demo cho nghiên cứu framework</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Một danh mục sản phẩm dùng chung dữ liệu để minh họa trải nghiệm thương mại điện tử giữa Nuxt và Next.js.</p>
        <NuxtLink class="mt-8 inline-flex rounded-md bg-sky-400 px-5 py-3 font-semibold text-slate-950 hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" to="/products">
          Xem tất cả sản phẩm
        </NuxtLink>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight text-slate-950">Thương hiệu có trong dữ liệu</h2>
      <ul class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <li v-for="brand in brands" :key="brand.value" class="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-semibold text-slate-800">
          {{ brand.label }} <span class="font-normal text-slate-500">({{ brand.productCount }})</span>
        </li>
      </ul>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Nổi bật</p>
          <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-950">Sản phẩm featured</h2>
        </div>
        <NuxtLink class="rounded text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600" to="/products">Xem danh sách đầy đủ</NuxtLink>
      </div>

      <ProductGridSkeleton v-if="!data && !error" class="mt-6" />
      <div v-else-if="error" class="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        Không thể tải sản phẩm featured. Vui lòng thử lại sau.
      </div>
      <ProductGrid v-else :categories="categories" :products="featuredProducts" class="mt-6" />
    </section>
  </div>
</template>
