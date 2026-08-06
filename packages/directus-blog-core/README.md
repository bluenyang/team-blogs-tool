# @croffledev/directus-blog-core

Directus GraphQL 쿼리 · mapper · DTO 타입을 담는 순수 TypeScript 패키지입니다.
Nuxt / Nitro에 의존하지 않습니다.

## 설치

```bash
pnpm add @croffledev/directus-blog-core
```

## 사용

```ts
import {
  buildQuery,
  createBlogCore,
  homeQuery,
  sidebarQuery,
} from '@croffledev/directus-blog-core';

const { client, blogSlug, mappers } = createBlogCore({
  directusUrl: process.env.DIRECTUS_URL!,
  blogSlug: process.env.BLOG_SLUG!,
});

const raw = await client.query(buildQuery(homeQuery(blogSlug), sidebarQuery(blogSlug)));
const home = mappers.home(raw);
```

## API

- `createBlogCore({ directusUrl, blogSlug })` — client + asset resolver + bound mappers
- Query builders: `homeQuery`, `postsQuery`, `postDetailQuery`, `sidebarQuery`, …
- `buildQuery(...fragments)` — GraphQL document 조립
- Mappers: `createBlogMappers(resolveAssetUrl)` 또는 개별 함수 (`postMapper(raw, resolveAssetUrl)`)
- Utils: `buildTree`, `decodeRouteSlug`, `collectCategorySlugs`
- Types: DTO (`PostItem`, `SidebarContent`, …) + Raw GraphQL 응답 타입

이미지 URL이 필요한 mapper는 `AssetUrlResolver`를 인자로 받습니다.
`createBlogCore` / `createBlogMappers`를 쓰면 URL이 바인딩된 mapper를 바로 쓸 수 있습니다.
