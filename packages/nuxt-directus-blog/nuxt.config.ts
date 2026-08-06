// Nuxt Layer — Nitro API routes & data composables for Directus blogs.
// Apps consume via: extends: ['@croffledev/nuxt-directus-blog']
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      homepageUrl: '',
      blogUrl: '',
      blogSlug: '',
      directusUrl: '',
      emailAddress: '',
      blogTitle: '',
      blogDescription: '',
      blogAuthor: '',
      profileImageUrl: '',
      githubUrl: '',
    },
  },
});
