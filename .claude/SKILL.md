---
name: croffle-blogs
description: >-
  Croffle Directus 블로그 모노레포(@croffledev/blogs)에서 작업할 때 사용한다.
  Nuxt 4 앱(croffle-blog, template-blog), Nuxt Layer(nuxt-directus-blog),
  코어 패키지(directus-blog-core), 스캐폴딩 CLI(create-croffle-blog)를 다룰 때 —
  컴포넌트/스타일 수정, Directus 쿼리·매퍼·DTO 변경, Nitro API 라우트 추가,
  검증(lint/typecheck/build), 커밋, changeset, Cloudflare 배포에 적용된다.
---

# Croffle Blogs 작업 스킬

규칙의 원본은 [AGENTS.md](../AGENTS.md)다. 이 문서는 **작업 종류별로 무엇을 어떤 순서로 하는지**를 담는다.
충돌하면 AGENTS.md가 이긴다.

## 0. 시작 전 3줄

1. 새 채팅이면 `/spec`으로 `.ai/`의 이전 맥락부터 복원한다.
2. 어디를 고쳐야 하는지 정한다 — **앱이 아니라 패키지가 정착지인 경우가 많다** (§2).
3. `master`에서 작업하지 않는다. 브랜치를 먼저 만든다.

## 1. 슬래시 커맨드

| 커맨드                               | 언제                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `/spec`                              | 새 채팅 시작 — `.ai/` + git 상태로 하던 작업 복원         |
| `/worklog`                           | 작업 구간이 끝날 때 — `.ai/`에 진행상황 기록              |
| `/test [all\|quick\|core\|blog\|ui]` | 변경 검증 (테스트 러너 없음 = lint→build→typecheck→build) |
| `/deploy blog\|packages`             | 운영 블로그 푸시 배포 / changeset npm 배포                |

## 2. 어디를 고칠 것인가

```
apps/croffle-blog ─┐
apps/template-blog ─┴→ nuxt-directus-blog (Layer) → directus-blog-core (dist)
```

| 바꾸려는 것                 | 고칠 곳                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| 화면 레이아웃·컴포넌트      | `apps/<app>/app/components/`, `app/pages/`                         |
| 색·다크모드                 | `apps/<app>/app/assets/css/theme.css` (`:root`와 `.dark` **양쪽**) |
| 본문(마크다운) 스타일       | `apps/<app>/app/components/prose/prose-*.vue`                      |
| Directus 쿼리·매퍼·DTO 타입 | `packages/directus-blog-core/src/{queries,mappers,types}/`         |
| API 엔드포인트              | `packages/nuxt-directus-blog/server/api/`                          |
| 데이터 훅                   | `packages/nuxt-directus-blog/app/composables/`                     |
| 스캐폴딩 CLI                | `packages/create-croffle-blog/`                                    |

판단 기준:

- **두 앱에 같은 코드를 넣고 싶어지면** 잘못 고르고 있는 것이다. 패키지로 올린다.
- `apps/template-blog` 변경은 `create-croffle-blog/template/`으로 흘러간다(prepack 동기화).
  운영 전용 값·실험은 `apps/croffle-blog`에만.
- `directus-blog-core`를 고쳤으면 **빌드해야** 나머지에 반영된다.

## 3. 작업 종류별 절차

### 3.1 UI 컴포넌트 추가·수정

1. 파일명 kebab-case로 만든다 → 템플릿에선 PascalCase 자동 import
   (`app/components/post-card.vue` → `<PostCard />`, `sidebar/category-tree.vue` → `<SidebarCategoryTree />`).
2. `<script setup lang="ts">` + `defineProps<{ ... }>()` **타입 기반만**. 런타임 객체 선언은 린트 에러.
3. 색은 `theme.css` 시맨틱 토큰만 (`bg-card`, `text-muted-foreground`, `border-border` …).
   **`bg-neutral-900`, `text-sky-500` 같은 Tailwind 팔레트 직접 사용 금지** — 라이트/다크가 깨진다.
   새 색이 필요하면 `:root`/`.dark` 양쪽에 토큰 추가 후 `@theme inline`에 매핑.
4. 조건부 클래스는 `cn()`. 문자열 이어붙이기 금지. 클래스 정렬은 oxfmt가 한다 — 손대지 않는다.
5. 아이콘은 `<Icon name="lucide:calendar" class="size-4" />`. 인라인 SVG 붙여넣지 않는다.
6. 이미지 `<NuxtImg>`, 내부 링크 `<NuxtLink>`, 시간 `<time :datetime>`, 진행 상태 `:aria-busy`.
7. 모바일 우선 → `md:` / `lg:`로 확장.
8. `/test ui`로 라이트/다크 양쪽 확인.

### 3.2 Directus 데이터 변경 (필드 추가 등)

순서를 지킨다 — 아래에서 위로 올라온다.

1. `src/types/raw/` — Directus 원본 응답 타입
2. `src/queries/` — GraphQL 쿼리에 필드 추가
3. `src/types/dto/` — 앱이 쓸 DTO
4. `src/mappers/` — raw → DTO 변환
5. 각 디렉터리의 `index.ts` 배럴에 export 추가
6. `pnpm --filter @croffledev/directus-blog-core build`
7. 소비하는 Layer 라우트/composable, 앱 컴포넌트 순으로 반영
8. publish 패키지가 바뀌었으므로 **changeset 추가** (§5)

### 3.3 API 라우트 추가

- 위치: `packages/nuxt-directus-blog/server/api/`
- 파일명은 Nitro 규약을 따른다: `posts.get.ts`, `post/[idx].get.ts`, `routes/rss.xml.ts`
  (이건 kebab-case 규칙의 허용된 예외다)
- 서버 헬퍼는 `server/utils/`(`use-blog-core.ts`, `use-query.ts`)를 재사용한다
- Layer에는 자체 typecheck가 없다 → **소비 앱으로 검증**: `pnpm --filter @croffledev/team-blog typecheck`

## 4. 코드 규칙 (자주 걸리는 것만)

- **파일·디렉터리는 kebab-case.** 예외는 Nuxt 동적 라우트(`[idx].vue`), Nitro 접미사(`*.get.ts`), 루트 관례 파일.
- 식별자: 변수·함수 camelCase, composable `useXxx`, 타입·컴포넌트 PascalCase.
- 타입 import는 `import type { ... }` 또는 `import { type X }`.
- `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`.
  인덱스 접근 결과는 `undefined`일 수 있다 — `!` 대신 가드로 좁힌다.
- 의존성 추가 전에 이미 있는 것부터 찾는다: `@vueuse/core`, `clsx`, `tailwind-merge`, `@nuxt/icon`.
- 생성물(`.nuxt`, `.output`, `dist`, `node_modules`)과 `pnpm-lock.yaml`은 손으로 고치지 않는다.
- 비밀값은 `.env` / `runtimeConfig`로만. 새 환경변수를 추가하면 `apps/*/.env.example`과 README 표를 같이 갱신한다.

### 린트 에러는 끄지 말고 고친다

가장 중요한 규칙이다 (AGENTS.md §4.1).

- `// oxlint-disable`, `.oxlintrc.json`의 `"off"`, `@ts-ignore` 추가는 **금지**.
- `no-explicit-any` → 실제 타입 정의하거나 `unknown` + 좁히기.
- `no-unused-vars` → 삭제로 해결.
- 규칙을 정말 바꿔야 한다면 그건 코드 변경이 아니라 **설정 변경**이다. 이유와 대안을 설명하고 사용자 승인을 받는다.
- `pnpm lint`는 `--fix` 포함 — 실행 후 **남은** 에러가 진짜다.

## 5. 검증 · 커밋 · 배포

### 검증 (끝났다고 보고하기 전에 **실제로** 실행)

```bash
pnpm lint
```

```bash
pnpm --filter @croffledev/directus-blog-core build
```

```bash
pnpm typecheck
```

```bash
pnpm build
```

순서가 중요하다 — core는 `dist`로 소비되므로 typecheck 전에 빌드한다. CI도 같은 순서다.
**실패하면 실패했다고 그대로 보고한다.** 안 돌린 단계는 안 돌렸다고 쓴다.

### 커밋

```
<type>(<scope>): <subject>
```

- type: `feat` `fix` `docs` `chore` `ci` `refactor` `test` `perf` `style`
- scope: `core` `layer` `template-blog` `croffle-blog` `cli` `release` `ci`
- 소문자·명령형·마침표 없음. 논리 단위로 쪼갠다. 포맷팅만 하는 변경은 섞지 않는다.
- **사용자가 요청하지 않았으면 커밋·푸시하지 않는다.** husky 훅을 `--no-verify`로 건너뛰지 않는다.

### Changesets

publish 패키지(`directus-blog-core`, `nuxt-directus-blog`, `create-croffle-blog`) 동작이 바뀌면
`pnpm changeset`으로 함께 추가한다. 버전 bump·배포는 Release 워크플로가 한다 —
`pnpm version-packages` / `pnpm release`를 로컬에서 임의로 실행하지 않는다.

## 6. 사용자 승인이 필요한 것

- 린트/포맷 규칙, 툴체인, 스택 자체를 바꾸는 변경
- 테스트 러너 도입 (현재 없음)
- 커밋 · 푸시 · 배포 · npm publish
- `.oxlintrc.json` 규칙을 끄거나 예외를 두는 것
