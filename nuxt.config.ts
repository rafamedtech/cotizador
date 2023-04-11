// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //   css: ['@/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon', '@vueuse/nuxt', '@nuxtjs/supabase'],

  pinia: {
    autoImports: ['storeToRefs'],
  },

  imports: {
    dirs: ['stores'],
  },
});
