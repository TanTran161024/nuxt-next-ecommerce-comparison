<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { formatVnd } from '../utils/product-presentation'

const cart = useCartStore()
onMounted(cart.hydrate)
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <h1 class="text-3xl font-bold tracking-tight text-slate-950">Giỏ hàng</h1>
    <p v-if="!cart.hydrated" class="mt-6 text-slate-600">Đang khôi phục giỏ hàng…</p>
    <div v-else-if="!cart.items.length" class="mt-6 rounded-xl border bg-white p-6">
      <p class="font-semibold">Giỏ hàng của bạn đang trống</p>
      <NuxtLink class="mt-4 inline-flex rounded bg-slate-950 px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" to="/products">Tiếp tục mua sắm</NuxtLink>
    </div>
    <div v-else class="mt-6 rounded-xl border bg-white p-5">
      <CartItem v-for="item in cart.items" :key="item.productId" :item="item" @change="cart.change" @remove="cart.remove" />
      <p class="mt-6 text-xl font-bold">Tổng tiền: {{ formatVnd(cart.total) }}</p>
      <button class="mt-4 rounded bg-slate-950 px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" type="button" @click="cart.clear">Xóa toàn bộ</button>
    </div>
  </section>
</template>
