# @croffledev/directus-blog-core

Directus GraphQL 쿼리 · mapper · DTO 타입을 담는 순수 TypeScript 패키지입니다.

## 예정 API

- `createBlogClient({ directusUrl, blogSlug })`
- GraphQL query builders (`home`, `posts`, `sidebar`, `category`, …)
- raw → DTO mappers
- shared types (`Post`, `Category`, `Sidebar`, …)

현재는 스캐폴드만 있으며, 참고 구현은 `my-blog`의 `server/features` · `shared/types`입니다.
