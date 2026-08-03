import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-03',
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
