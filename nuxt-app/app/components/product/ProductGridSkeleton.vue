<template>
  <div aria-label="Đang tải sản phẩm" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status">
    <div v-for="index in 8" :key="index" class="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="aspect-[4/3] bg-slate-200" />
      <div class="space-y-3 p-4">
        <div class="h-3 w-1/3 rounded bg-slate-200" />
        <div class="h-5 w-4/5 rounded bg-slate-200" />
        <div class="h-4 w-3/5 rounded bg-slate-200" />
      </div>
    </div>
    <span class="sr-only">Đang tải danh sách sản phẩm</span>
  </div>
</template>
