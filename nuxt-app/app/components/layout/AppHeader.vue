<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useCartStore } from '../../stores/cart'

const open = ref(false)
const route = useRoute()
const cart = useCartStore()
const close = (): void => { open.value = false }
const onKeydown = (event: KeyboardEvent): void => { if (event.key === 'Escape') close() }
onMounted(() => { cart.hydrate(); window.addEventListener('keydown', onKeydown) })
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
watch(() => route.fullPath, close)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 shadow-sm backdrop-blur">
    <div class="site-container flex h-[var(--header-height)] items-center justify-between gap-3">
      <NuxtLink class="text-base font-black tracking-tight text-[var(--color-text)] sm:text-lg" to="/">Bước Chân Demo</NuxtLink>
      <nav class="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
        <NuxtLink active-class="bg-[var(--color-surface-muted)] text-[var(--color-primary)]" class="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]" to="/">Trang chủ</NuxtLink>
        <NuxtLink active-class="bg-[var(--color-surface-muted)] text-[var(--color-primary)]" class="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]" to="/products">Sản phẩm</NuxtLink>
      </nav>
      <div class="flex items-center gap-2">
        <NuxtLink aria-label="Giỏ hàng" class="relative inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 text-sm font-semibold hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" to="/cart"><svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l2.1 10.5a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg><span class="hidden sm:inline">Giỏ hàng</span><span v-if="cart.hydrated && cart.count" class="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs text-white">{{ cart.count }}</span></NuxtLink>
        <button :aria-expanded="open" aria-controls="mobile-menu" aria-label="Mở menu" class="inline-flex rounded-[var(--radius-sm)] border border-[var(--color-border)] p-2 md:hidden" type="button" @click="open = !open"><svg aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" stroke-width="1.8"/></svg></button>
      </div>
    </div>
    <nav v-if="open" id="mobile-menu" class="border-t border-[var(--color-border)] bg-white p-3 md:hidden" aria-label="Điều hướng di động"><div class="site-container grid gap-1"><NuxtLink class="rounded px-3 py-3 font-semibold hover:bg-[var(--color-surface-muted)]" to="/">Trang chủ</NuxtLink><NuxtLink class="rounded px-3 py-3 font-semibold hover:bg-[var(--color-surface-muted)]" to="/products">Sản phẩm</NuxtLink><NuxtLink class="rounded px-3 py-3 font-semibold hover:bg-[var(--color-surface-muted)]" to="/cart">Giỏ hàng</NuxtLink></div></nav>
  </header>
</template>
