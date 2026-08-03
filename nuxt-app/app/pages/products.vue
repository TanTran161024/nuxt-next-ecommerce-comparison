<script setup lang="ts">
import { computed, watch } from 'vue'
import type { ProductFilters, ProductListResponse } from '../../shared/types/product'
import { filtersToQuery, normalizeProductQuery } from '../utils/product-filters'
import { useProductStore } from '../stores/product'

useSeoMeta({
  title: 'Sản phẩm | Bước Chân Demo',
  description: 'Danh sách giày dép demo với bộ lọc thương hiệu, loại, màu sắc và giá.',
})

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const apiQuery = computed(() => normalizeProductQuery(route.query))

watch(
  () => route.query,
  (query) => productStore.restoreFiltersFromQuery(query),
  { immediate: true },
)

const { data, error, status, refresh } = await useAsyncData<ProductListResponse>(
  'product-list',
  () => $fetch('/api/products', { query: apiQuery.value }),
  { watch: [apiQuery] },
)

watch(
  data,
  (productList) => {
    if (productList) {
      productStore.setProductList(productList)
    }
  },
  { immediate: true },
)

const applyFilters = async (filters: ProductFilters): Promise<void> => {
  productStore.setFilters(filters)
  await router.push({ query: filtersToQuery(filters) })
}

const resetFilters = async (): Promise<void> => {
  productStore.resetFilters()
  await router.push({ query: {} })
}

const retry = (): void => {
  void refresh()
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="max-w-3xl">
      <p class="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Danh mục</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Sản phẩm giày dép demo</h1>
      <p class="mt-3 text-slate-600">Lọc dữ liệu trực tiếp từ Nitro API mà không tải lại toàn bộ trang.</p>
    </div>

    <ProductFilters
      class="mt-8"
      :brands="data?.availableBrands ?? []"
      :categories="data?.availableCategories ?? []"
      :colors="data?.availableColors ?? []"
      :filters="productStore.filters"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
      <p aria-live="polite" class="text-sm text-slate-600">
        <template v-if="data">Tìm thấy <strong class="text-slate-950">{{ data.total }}</strong> sản phẩm</template>
        <template v-else>Đang tải kết quả</template>
      </p>
    </div>

    <ProductGridSkeleton v-if="status === 'pending'" class="mt-5" />
    <section v-else-if="error" class="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-6" aria-labelledby="products-error-title">
      <h2 id="products-error-title" class="font-semibold text-rose-900">Không thể tải danh sách sản phẩm</h2>
      <p class="mt-2 text-sm text-rose-800">Vui lòng kiểm tra lại điều kiện lọc hoặc thử lại.</p>
      <button class="mt-4 rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="retry">Thử lại</button>
    </section>
    <ProductEmptyState v-else-if="data && data.total === 0" class="mt-5" />
    <ProductGrid v-else-if="data" :categories="data.availableCategories" :products="data.items" class="mt-5" />
  </section>
</template>
