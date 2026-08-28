# @croffledev/blogs

Croffle Directus 블로그 모노레포입니다. 같은 CMS 스키마로 팀 블로그를 빠르게 만들 수 있도록, 코어 패키지와 템플릿 앱을 분리합니다.

## 구조

```
apps/
  croffle-blog/               # 운영 블로그 (private, Cloudflare Workers 배포)
  template-blog/              # 팀원용 Nuxt 스캐폴드 (private, CLI 템플릿 원본)
packages/
  directus-blog-core/         # GraphQL query · mapper · types (publish)
  nuxt-directus-blog/         # Nuxt Layer — API + composables (publish)
  create-croffle-blog/        # 스캐폴딩 CLI (publish)
```

## 스택

| 구분          | 기술                 |
| ------------- | -------------------- |
| 패키지 매니저 | pnpm workspaces      |
| 버전 관리     | Changesets           |
| 린트 / 포맷   | oxlint · oxfmt (OXC) |
| Git hooks     | husky + lint-staged  |
| CMS           | Directus (GraphQL)   |
| 앱 프레임워크 | Nuxt 4               |

## 시작

```bash
corepack enable
pnpm install
cp apps/template-blog/.env.example apps/template-blog/.env
pnpm dev
```

## CLI로 새 블로그 만들기

```bash
pnpm create croffle-blog my-blog
# 또는
npx create-croffle-blog my-blog
```

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm changeset          # 패키지 변경 기록
pnpm version-packages   # 버전 bump
pnpm release            # build + npm publish
```

## GitHub Actions

| 워크플로      | 트리거                         | 하는 일                                       |
| ------------- | ------------------------------ | --------------------------------------------- |
| `CI`          | PR · push                      | lint · core build · typecheck · build         |
| `Release`     | master push                    | Changesets Version PR 또는 npm publish (OIDC) |
| `Secret Scan` | PR · push · 매주 월요일 · 수동 | TruffleHog 시크릿 스캔 (주간은 전체 히스토리) |
| `Labeler`     | PR                             | 변경 경로 기반 자동 라벨링                    |

- 최초 publish는 로컬에서 한 뒤, npm 패키지 설정에서 Trusted Publisher에 workflow `release.yml`을 연결하세요.
- 라벨 규칙은 [.github/labeler.yml](.github/labeler.yml), 리뷰어 자동 지정은 [.github/CODEOWNERS](.github/CODEOWNERS)에 있습니다.
  저장소에 없는 라벨은 `Labeler` 워크플로가 자동으로 만듭니다 (색·설명은 기본값이니 나중에 손보세요).

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
PROFILE_IMAGE_URL=
GITHUB_URL=
```

> 비밀값은 코드나 커밋에 넣지 말고 `.env` / `runtimeConfig`로 주입하세요.
> `Secret Scan` 워크플로가 PR과 매주 전체 히스토리를 훑습니다.

## 로드맵

1. ~~`my-blog`의 `server/features` · `shared/types`를 `directus-blog-core`로 이전~~
2. ~~Nitro API · composable을 `nuxt-directus-blog` Layer로 이전~~
3. ~~`template-blog` Nuxt 앱 + `create-croffle-blog` CLI~~
4. Changesets로 코어 패키지 버전 배포

## 기여

작업 절차와 검증 순서는 [CONTRIBUTING.md](CONTRIBUTING.md), 코드 스타일·네이밍·린트 규약은 [AGENTS.md](AGENTS.md)에 있습니다.

## 라이선스

[MIT](LICENSE) © team-croffle
