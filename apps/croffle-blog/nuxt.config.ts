import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  extends: ['@croffledev/nuxt-directus-blog'],

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/motion',
    '@vueuse/nuxt',
    '@comark/nuxt',
  ],

  ssr: true,

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  app: {
    head: {
      // 라이트 시안이 없어 다크 단일 테마다. 브라우저 기본 UI도 다크로 맞춘다.
      htmlAttrs: { lang: 'ko', class: 'dark', 'data-theme': 'dark' },
      meta: [
        { name: 'color-scheme', content: 'dark' },
        { name: 'theme-color', content: '#171310' },
      ],
    },
  },

  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Noto Sans KR', provider: 'google', weights: [300, 400, 500, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.BLOG_URL || 'http://localhost:3000',
    name: process.env.BLOG_TITLE || 'Croffle Dev. Blog',
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storage: 'cookie',
  },

  runtimeConfig: {
    public: {
      homepageUrl: process.env.HOMEPAGE_URL || '',
      blogUrl: process.env.BLOG_URL || '',
      blogSlug: process.env.BLOG_SLUG || '',
      directusUrl: process.env.DIRECTUS_URL || '',
      emailAddress: process.env.EMAIL_ADDRESS || '',
      blogTitle: process.env.BLOG_TITLE || 'Croffle Dev. Blog',
      blogDescription: process.env.BLOG_DESCRIPTION || '',
      blogAuthor: process.env.BLOG_AUTHOR || '',
      profileImageUrl: process.env.PROFILE_IMAGE_URL || '',
      githubUrl: process.env.GITHUB_URL || '',
      discordUrl: process.env.DISCORD_URL || '',
    },
  },

  // 엣지/프록시 캐시 계층. Nitro API 라우트의 defineCachedEventHandler와 2단으로 겹친다.
  routeRules: {
    '/': { swr: 180 },
    '/posts': { swr: 180 },
    '/posts/**': { swr: 300 },
    '/categories/**': { swr: 180 },
    '/tags': { swr: 600 },
    '/tags/**': { swr: 180 },
    '/series': { swr: 600 },
    '/series/**': { swr: 180 },
    '/authors': { swr: 600 },
    '/authors/**': { swr: 300 },
    '/search': { swr: 60, robots: false },
    '/license': { swr: 86400 },
  },

  compatibilityDate: '2026-06-15',

  image: {
    format: ['webp'],
    quality: 80,
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@comark/nuxt > @comark/vue',
        '@croffledev/directus-blog-core > @directus/sdk',
        'shiki > @shikijs/langs',
        'shiki > @shikijs/themes',
        'clsx',
        'comark',
        'comark/plugins/toc',
        'comark/utils',
        'tailwind-merge',
      ],
    },
  },

  icon: {
    mode: 'svg',
    cssLayer: 'base',
    size: '1.25em',
  },

  sitemap: {
    sources: ['/api/sitemap-urls'],
    exclude: ['/api/**', '/rss.xml', '/search'],
  },

  robots: {
    disallow: ['/search', '/api/'],
  },
});
