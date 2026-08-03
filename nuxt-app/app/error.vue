<script setup lang="ts">
defineProps<{ error: Error }>()
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="text-2xl font-bold text-slate-900">An unexpected error occurred</h1>
  </main>
</template>
