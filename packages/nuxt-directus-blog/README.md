# @croffledev/nuxt-directus-blog

Nuxt Layer 패키지입니다. Nitro `/api/*` 라우트와 data composable을 제공하고,
`@croffledev/directus-blog-core`를 사용합니다.

## 사용

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@croffledev/nuxt-directus-blog'],
  runtimeConfig: {
    public: {
      blogUrl: process.env.BLOG_URL,
      blogSlug: process.env.BLOG_SLUG,
      directusUrl: process.env.DIRECTUS_URL,
      homepageUrl: process.env.HOMEPAGE_URL,
      emailAddress: process.env.EMAIL_ADDRESS,
      blogTitle: process.env.BLOG_TITLE,
      blogDescription: process.env.BLOG_DESCRIPTION,
      blogAuthor: process.env.BLOG_AUTHOR,
    },
  },
});
```

## 제공 API

| Method | Path                | 설명                                   |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/api/home`         | 최근 글 · 시리즈                       |
| GET    | `/api/posts`        | 목록 / 검색 / category·tag·series 필터 |
| GET    | `/api/post/:idx`    | 글 상세                                |
| GET    | `/api/sidebar`      | 사이드바 트리                          |
| GET    | `/api/sitemap-urls` | sitemap source                         |
| GET    | `/rss.xml`          | RSS 2.0                                |

## Composables

- `useHome()`
- `usePostList(limit, page, search?, category?, tag?, series?)`
- `usePostDetail(postIdx)`
- `useSidebar()`
- `useSetting()` — sidebar payload의 `blogSettings`

UI/브랜드는 앱에 두고, 이 Layer는 CMS 계약과 data fetching만 담당합니다.
