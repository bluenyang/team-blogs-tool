# @croffledev/blogs

Croffle Directus 블로그 모노레포입니다. 같은 CMS 스키마로 팀 블로그를 빠르게 만들 수 있도록, 코어 패키지와 템플릿 앱을 분리합니다.

## 구조

```
apps/
  template-blog/              # 팀원용 Nuxt 스캐폴드 (private)
packages/
  directus-blog-core/         # GraphQL query · mapper · types (publish)
  nuxt-directus-blog/         # Nuxt Layer — API + composables (publish)
```

## 스택

| 구분          | 기술                 |
| ------------- | -------------------- |
| 패키지 매니저 | pnpm workspaces      |
| 버전 관리     | Changesets           |
| 린트 / 포맷   | oxlint · oxfmt (OXC) |
| Git hooks     | husky + lint-staged  |
| CMS           | Directus (GraphQL)   |
| 앱 프레임워크 | Nuxt 4 (예정)        |

## 시작

```bash
corepack enable
pnpm install
```

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm changeset          # 패키지 변경 기록
```

## 환경 변수 (앱)

```env
BLOG_URL=https://blog.example.com
BLOG_SLUG=your-slug
DIRECTUS_URL=https://your-directus.example
EMAIL_ADDRESS=you@example.com
HOMEPAGE_URL=https://www.example.com
BLOG_TITLE=Example Blog
BLOG_DESCRIPTION=Team engineering notes
BLOG_AUTHOR=Example
```

## 로드맵

1. ~~`my-blog`의 `server/features` · `shared/types`를 `directus-blog-core`로 이전~~
2. ~~Nitro API · composable을 `nuxt-directus-blog` Layer로 이전~~
3. `template-blog`를 Nuxt 앱으로 채우고 브랜드 설정만 env/config로 주입
4. Changesets로 코어 패키지 버전 배포
