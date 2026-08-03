<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Brand, Category, ProductFilters } from '../../../shared/types/product'

interface FilterForm {
  brand: string
  category: string
  color: string
  minPrice: string
  maxPrice: string
}

const props = defineProps<{
  filters: ProductFilters
  brands: Brand[]
  categories: Category[]
  colors: string[]
}>()

const emit = defineEmits<{
  apply: [filters: ProductFilters]
  reset: []
}>()

const form = reactive<FilterForm>({
  brand: '',
  category: '',
  color: '',
  minPrice: '',
  maxPrice: '',
})

const copyFiltersToForm = (filters: ProductFilters): void => {
  form.brand = filters.brand ?? ''
  form.category = filters.category ?? ''
  form.color = filters.color ?? ''
  form.minPrice = filters.minPrice === undefined ? '' : String(filters.minPrice)
  form.maxPrice = filters.maxPrice === undefined ? '' : String(filters.maxPrice)
}

watch(() => props.filters, copyFiltersToForm, { deep: true, immediate: true })

const toPrice = (value: string): number | undefined => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  const price = Number(trimmedValue)
  return Number.isFinite(price) && price >= 0 ? price : undefined
}

const applyFilters = (): void => {
  const filters: ProductFilters = {}
  const minPrice = toPrice(form.minPrice)
  const maxPrice = toPrice(form.maxPrice)

  if (form.brand) filters.brand = form.brand
  if (form.category) filters.category = form.category
  if (form.color) filters.color = form.color
  if (minPrice !== undefined) filters.minPrice = minPrice
  if (maxPrice !== undefined) filters.maxPrice = maxPrice

  emit('apply', filters)
}

const resetFilters = (): void => {
  copyFiltersToForm({})
  emit('reset')
}
</script>

<template>
  <form class="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5" @submit.prevent="applyFilters">
    <div>
      <label class="mb-1 block text-sm font-semibold text-slate-800" for="brand">Thương hiệu</label>
      <select id="brand" v-model="form.brand" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-sky-600">
        <option value="">Tất cả thương hiệu</option>
        <option v-for="brand in brands" :key="brand.value" :value="brand.value">{{ brand.label }}</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-sm font-semibold text-slate-800" for="category">Loại sản phẩm</label>
      <select id="category" v-model="form.category" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus-visible:outline-sky-600">
        <option value="">Tất cả loại sản phẩm</option>
        <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
      </select>
    </div>
    <div>
      <label class="mb-1 block text-sm font-semibold text-slate-800" for="color">Màu sắc</label>
      <select id="color" v-model="form.color" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus-visible:outline-sky-600">
        <option value="">Tất cả màu sắc</option>
        <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-3 xl:col-span-2">
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-800" for="minPrice">Giá tối thiểu</label>
        <input id="minPrice" v-model="form.minPrice" inputmode="numeric" min="0" name="minPrice" type="number" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus-visible:outline-sky-600">
      </div>
      <div>
        <label class="mb-1 block text-sm font-semibold text-slate-800" for="maxPrice">Giá tối đa</label>
        <input id="maxPrice" v-model="form.maxPrice" inputmode="numeric" min="0" name="maxPrice" type="number" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus-visible:outline-sky-600">
      </div>
    </div>
    <div class="flex items-end gap-2 xl:col-span-5">
      <button class="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="submit">Áp dụng</button>
      <button class="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="resetFilters">Đặt lại</button>
    </div>
  </form>
</template>
