# Handoff: Croffle Directus Blog Monorepo

## 목표

같은 Directus CMS를 쓰는 팀 블로그를 빠르게 만들기 위해,
현재 개인 블로그(my-blog)를 템플릿/라이브러리화하고 monorepo로 구성한다.

## 결정사항

- CMS: Directus GraphQL (기존과 동일)
- 멀티 블로그 키: `BLOG_SLUG` / `blog_id.slug` 필터
- 패키지 매니저: **pnpm** workspaces
- 버전 관리: **Changesets** (앱은 ignore, packages만 publish)
- 린트/포맷: **oxlint + oxfmt** (my-blog에서 이식)
- Git hooks: **husky + lint-staged**
- 구조 방향:
  1. `@croffledev/directus-blog-core` — 순수 TS (query/mapper/types/client)
  2. `@croffledev/nuxt-directus-blog` — Nuxt Layer (Nitro API + composables)
  3. `apps/template-blog` — 팀원이 복사해서 쓰는 Nuxt 스캐폴드
- UI/브랜드는 앱에 남기고, CMS 계약만 패키지로 공유
- 카테고리: 지금은 `/api/sidebar` + `/api/posts?category=`에 녹아 있음.
  템플릿에서는 전용 `GET /api/categories` 추가를 고려 (선택)

## 참고 구현 (원본 블로그)

- 경로: `W:\MyWorks\MyServerHomepage\my-blog`
- 스택: Nuxt 4.5 + Directus SDK 23 GraphQL + Tailwind 4 + Yarn 4
- 아키텍처: 프론트는 Directus 직접 호출 X → `/api/*` → server GraphQL
- 사이드바: README의 `?sidebar=true`는 예전 설명. 실제는 `useSidebar` → `GET /api/sidebar`

### 원본 인벤토리 (2026-08-06 검증)

#### → `directus-blog-core` 후보 (순수 TS)

| 원본 경로                                           | 내용                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `server/features/*.query.ts`                        | GraphQL 조각 (category/home/post/seo/series/sidebar/tag)     |
| `server/features/*.mapper.ts`                       | raw → DTO (+ `mapper.ts` barrel)                             |
| `server/features/query.ts`                          | query barrel                                                 |
| `server/types/raw-data/*`                           | Raw GraphQL 응답 타입                                        |
| `server/types/image.ts`                             | 이미지 query 타입                                            |
| `shared/types/*`                                    | 공개 DTO (category/home/nav/post/series/sidebar/tag/setting) |
| `shared/utils/build-tree.ts`                        | 카테고리 트리 유틸                                           |
| `shared/utils/decode-route-slug.ts`                 | 라우트 슬러그 디코드                                         |
| `server/utils/directus.ts`의 `createDirectusClient` | Nuxt 의존 없는 클라이언트 팩토리만                           |

`useDirectus` / `getDirectusImageUrl` / `useQuery`는 `useRuntimeConfig()`에 묶여 있어 **Layer** 쪽이 맞음.
core에는 `blogSlug`를 인자로 받는 query 빌더 + client 팩토리만 둔다.

#### → `nuxt-directus-blog` Layer 후보

| 원본 경로                                      | 내용                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `server/api/home.get.ts`                       | `GET /api/home`                                                    |
| `server/api/posts.get.ts`                      | `GET /api/posts` (search/category/tag/series + 자손 카테고리 수집) |
| `server/api/post/[idx].get.ts`                 | `GET /api/post/:idx`                                               |
| `server/api/sidebar.get.ts`                    | `GET /api/sidebar`                                                 |
| `server/api/sitemap-urls.ts`                   | sitemap source                                                     |
| `server/routes/rss.xml.ts`                     | RSS                                                                |
| `server/utils/directus.ts`                     | `useDirectus`, `getDirectusImageUrl`                               |
| `server/utils/use-query.ts`                    | runtimeConfig.blogSlug 주입 + query 조립                           |
| `server/types/rss.ts`, `sitemap.ts`            | 라우트 전용 타입                                                   |
| `app/composables/use-home.ts`                  | 홈                                                                 |
| `app/composables/use-post.ts`                  | 단건                                                               |
| `app/composables/use-post-list.ts`             | 목록                                                               |
| `app/composables/use-sidebar.ts`               | 사이드바                                                           |
| `app/composables/use-setting.ts`               | 설정                                                               |
| (검토) `use-snippet.ts`, `use-nav-feedback.ts` | UI/브랜드 성격이면 앱에 잔류                                       |

#### → `apps/template-blog`에 잔류 (UI/브랜드)

- `app/components/**`, `pages/**`, `layouts/**`, `assets/css/**`
- `app/constants/sidebar-data.ts` (BlueNyang 하드코딩 — env/config로 치환)
- brand 하드코딩: `banner-hero`, footer, RSS, SEO `ogSiteName`, `nuxt.config` `site.name`/`url`
- Tailwind / comark / shiki / icon / color-mode 등 프레젠테이션 의존성

#### runtimeConfig (원본 `nuxt.config`)

```ts
runtimeConfig: {
  public: {
    (homepageUrl, blogUrl, blogSlug, directusUrl, emailAddress);
  }
}
site: {
  url: 'https://blog.bluenyang.kr';
} // ← 템플릿에서 env로
```

## 이미 만든 monorepo

- 경로: `W:\MyWorks\croffledev\blogs`
- git init 완료 (branch: main, **커밋 없음** — 전부 untracked)
- `pnpm install` / lint / typecheck / core build 확인됨 (이전 세션)

```
blogs/
  apps/template-blog/              # package.json stub only
  packages/directus-blog-core/     # stub: PACKAGE_NAME + createBlogClientOptions
  packages/nuxt-directus-blog/     # stub: empty defineNuxtConfig
  .changeset/
  .husky/pre-commit
  .oxlintrc.json / .oxfmtrc.json
  pnpm-workspace.yaml
  packageManager: pnpm@10.18.3
```

## 환경 변수 계약

```env
BLOG_URL=
BLOG_SLUG=
DIRECTUS_URL=
EMAIL_ADDRESS=
HOMEPAGE_URL=
BLOG_TITLE=
BLOG_DESCRIPTION=
BLOG_AUTHOR=
```

## 진행 상태

- [x] `directus-blog-core` — types / queries / utils / mappers / `createBlogCore`
  - 이미지 URL은 `AssetUrlResolver` 주입 (`createBlogMappers` / `createBlogCore`)
  - Nuxt `useRuntimeConfig` 의존 제거
- [x] `nuxt-directus-blog` Layer — Nitro API + RSS + data composables
  - `useBlogCore` / `useQuery` / `useDirectus`
  - RSS 브랜드 필드는 `blogTitle` / `blogDescription` / `blogAuthor` runtimeConfig

## 다음 할 일 (우선순위)

1. (선택) `GET /api/categories` 전용 API 추가
2. `apps/template-blog`를 Nuxt 앱으로 채우고
   사이트명/프로필을 env·config로 주입 (BlueNyang 하드코딩 제거)
3. Changesets로 코어 패키지 버전 관리 시작

## 작업 시작 위치

워크스페이스: `W:\MyWorks\croffledev\blogs`
원본 참조: `W:\MyWorks\MyServerHomepage\my-blog` (읽기/추출용)
