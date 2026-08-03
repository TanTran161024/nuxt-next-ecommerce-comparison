<script setup lang="ts">
import type { Category, ProductListItem } from '../../../shared/types/product'
const props = defineProps<{ products: ProductListItem[], categories: Category[] }>()
const categoryLabelFor = (category: string): string => props.categories.find((item) => item.value === category)?.label ?? category
</script>
<template><div class="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><ProductCard v-for="product in products" :key="product.id" :category-label="categoryLabelFor(product.category)" :product="product" /></div></template>
