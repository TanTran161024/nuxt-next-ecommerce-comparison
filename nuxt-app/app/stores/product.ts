import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductFilters, ProductListResponse } from '../../shared/types/product'
import { queryToProductFilters, type ProductQuery } from '../utils/product-filters'

export const useProductStore = defineStore('product', () => {
  const filters = ref<ProductFilters>({})
  const productList = ref<ProductListResponse | null>(null)

  const setFilters = (nextFilters: ProductFilters): void => {
    filters.value = { ...nextFilters }
  }

  const restoreFiltersFromQuery = (query: ProductQuery): void => {
    filters.value = queryToProductFilters(query)
  }

  const resetFilters = (): void => {
    filters.value = {}
  }

  const setProductList = (nextProductList: ProductListResponse): void => {
    productList.value = nextProductList
  }

  return {
    filters,
    productList,
    setFilters,
    restoreFiltersFromQuery,
    resetFilters,
    setProductList,
  }
})
