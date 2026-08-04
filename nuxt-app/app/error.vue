<script setup lang="ts">
import type { NuxtError } from '#app'
import {
  productNotFoundPageDescription,
  productNotFoundPageTitle,
} from './utils/product-metadata'

const props = defineProps<{ error: NuxtError }>()

useSeoMeta({
  title: () => props.error.statusCode === 404 ? productNotFoundPageTitle : 'Đã xảy ra lỗi | Bước Chân Demo',
  description: () => props.error.statusCode === 404
    ? productNotFoundPageDescription
    : 'Vui lòng thử lại hoặc quay về danh sách sản phẩm.',
})
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
    <section class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Lỗi {{ error.statusCode }}</p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        {{ error.statusCode === 404 ? 'Không tìm thấy sản phẩm' : 'Đã xảy ra lỗi' }}
      </h1>
      <p class="mt-3 text-slate-600">
        {{ error.statusCode === 404 ? 'Sản phẩm bạn tìm không tồn tại hoặc đã được thay đổi.' : 'Vui lòng thử lại hoặc quay về danh sách sản phẩm.' }}
      </p>
      <NuxtLink class="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" to="/products">
        Về danh sách sản phẩm
      </NuxtLink>
    </section>
  </main>
</template>
