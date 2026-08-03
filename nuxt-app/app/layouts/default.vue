<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
