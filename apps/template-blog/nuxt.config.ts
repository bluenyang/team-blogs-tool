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
      htmlAttrs: { lang: 'ko' },
    },
  },

  fonts: {
    families: [
      { name: 'Tektur', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
      { name: 'Pacifico', provider: 'google' },
      { name: 'Jua', provider: 'google' },
      { name: 'Cascadia Code', provider: 'google', weights: [400, 700] },
    ],
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.BLOG_URL || 'http://localhost:3000',
    name: process.env.BLOG_TITLE || 'Croffle Blog',
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
      blogTitle: process.env.BLOG_TITLE || 'Croffle Blog',
      blogDescription: process.env.BLOG_DESCRIPTION || '',
      blogAuthor: process.env.BLOG_AUTHOR || '',
      profileImageUrl: process.env.PROFILE_IMAGE_URL || '',
      githubUrl: process.env.GITHUB_URL || '',
    },
  },

  routeRules: {
    '/': { swr: 180 },
    '/posts': { swr: 180 },
    '/posts/**': { swr: 180 },
    '/categories/**': { swr: 180 },
    '/tags/**': { swr: 180 },
    '/series/**': { swr: 180 },
    '/search': { swr: 180 },
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
        '@comark/vue',
        '@directus/sdk',
        '@shikijs/langs/bash',
        '@shikijs/langs/c',
        '@shikijs/langs/cpp',
        '@shikijs/langs/css',
        '@shikijs/langs/dockerfile',
        '@shikijs/langs/go',
        '@shikijs/langs/html',
        '@shikijs/langs/java',
        '@shikijs/langs/javascript',
        '@shikijs/langs/js',
        '@shikijs/langs/json',
        '@shikijs/langs/jsx',
        '@shikijs/langs/kotlin',
        '@shikijs/langs/md',
        '@shikijs/langs/mdc',
        '@shikijs/langs/py',
        '@shikijs/langs/sh',
        '@shikijs/langs/sql',
        '@shikijs/langs/plsql',
        '@shikijs/langs/ts',
        '@shikijs/langs/tsx',
        '@shikijs/langs/typescript',
        '@shikijs/langs/vue',
        '@shikijs/langs/xml',
        '@shikijs/langs/yaml',
        '@shikijs/langs/yml',
        '@shikijs/themes/one-dark-pro',
        'clsx',
        'comark',
        'comark/plugins/highlight',
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
    exclude: ['/api/post/**', '/api/home', '/api/posts', '/api/sidebar', '/rss.xml', '/search'],
  },

  robots: {
    disallow: ['/search', '/api/post/**', '/api/home', '/api/posts', '/api/sidebar'],
  },
});
