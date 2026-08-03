<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink class="rounded text-lg font-bold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600" to="/">
        Bước Chân Demo
      </NuxtLink>

      <nav aria-label="Điều hướng chính" class="flex items-center gap-4 text-sm font-semibold text-slate-700">
        <NuxtLink class="rounded px-2 py-1 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" to="/">
          Trang chủ
        </NuxtLink>
        <NuxtLink class="rounded px-2 py-1 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" to="/products">
          Sản phẩm
        </NuxtLink>
        <NuxtLink to="/cart">Giỏ hàng<span v-if="cart.hydrated"> ({{cart.count}})</span></NuxtLink>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">import { onMounted } from 'vue';import { useCartStore } from '../../stores/cart';const cart=useCartStore();onMounted(cart.hydrate)</script>
