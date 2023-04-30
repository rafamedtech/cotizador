// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //   css: ['@/assets/css/tailwind.css'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon', '@vueuse/nuxt', '@nuxtjs/supabase'],

  pinia: {
    autoImports: ['storeToRefs'],
  },

  imports: {
    dirs: ['stores'],
  },
});
