// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 开启静态站点生成 (SSG)
  ssr: true, 
  
  app: {
    head: {
      title: '玄武山佛祖灵签',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '玄武山佛祖灵签在线求签' }
      ]
    }
  },

  // 预渲染所有路由 (可选，Nuxt Crawler 通常能自动处理链接)
  nitro: {
    preset: 'github-pages'
  },
})
