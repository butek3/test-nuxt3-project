export default defineNuxtConfig({
  components: {
    dirs: [
      '~/components',
      '~/components/UI'
    ]
  },
  imports: {
    dirs: ['stores']
  },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/styles/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/variables.scss" as *;
            @use "~/assets/styles/mixins.scss" as *;
          `
        }
      }
    }
  }
});