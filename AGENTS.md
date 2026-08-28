# AGENTS.md

`@croffledev/blogs` — Croffle Directus 블로그 모노레포에서 작업하는 에이전트를 위한 규칙 문서입니다.
사람이 읽는 개요는 [README.md](README.md)를, 여기서는 **어떻게 작업하고 무엇으로 검증하는지**를 다룹니다.

## 1. 저장소 구조

```
apps/
  croffle-blog/               # 운영 블로그 (private, Cloudflare Workers 배포)
  template-blog/              # 팀원용 Nuxt 스캐폴드 (private, CLI 템플릿 원본)
packages/
  directus-blog-core/         # GraphQL query · mapper · DTO 타입 (publish)
  nuxt-directus-blog/         # Nuxt Layer — Nitro API + composables (publish)
  create-croffle-blog/        # 스캐폴딩 CLI (publish, 순수 ESM)
```

- 패키지 매니저는 **pnpm workspaces** 고정입니다. `npm` / `yarn` 명령을 쓰지 마세요.
- Node는 `>=22`, pnpm 버전은 루트 `package.json`의 `packageManager`가 결정합니다 (`corepack enable`).
- 앱 간 공통 로직은 앱에 복붙하지 말고 `packages/`로 올립니다. 데이터 페칭/타입은 `directus-blog-core`,
  Nuxt 런타임(Nitro 라우트·composable)은 `nuxt-directus-blog` Layer가 정착지입니다.
- `apps/template-blog`를 수정하면 `create-croffle-blog`의 `template/`이 `prepack` 시 동기화됩니다.
  템플릿에 들어가면 안 되는 변경(운영 전용 값 등)은 `apps/croffle-blog`에만 넣으세요.

## 2. UI 스타일

### 2.1 기술 스택

Nuxt 4 + Vue 3 `<script setup lang="ts">` + Tailwind CSS v4 (`@tailwindcss/vite`) 조합입니다.
`tailwind.config.js`는 없습니다 — 테마는 전부 CSS에 있습니다.

- `app/assets/css/main.css` → `tailwind.css`와 `theme.css`를 import
- `app/assets/css/tailwind.css` → `@import 'tailwindcss'` 한 줄
- `app/assets/css/theme.css` → 디자인 토큰(`:root`, `.dark`)과 `@theme inline` 매핑

### 2.2 색은 반드시 시맨틱 토큰으로

`theme.css`에 정의된 토큰만 사용합니다. Tailwind 기본 팔레트 색(`bg-neutral-900`, `text-sky-500` 등)을
컴포넌트에 직접 쓰지 마세요 — 라이트/다크가 깨집니다.

```
background / foreground        card / card-foreground / card-hover
primary / primary-foreground   secondary / secondary-foreground
muted / muted-foreground       accent / accent-foreground
destructive / border / input / ring
sidebar-* / header-* / table-* / codeblock-* / blockquote-accent
```

- 새 색이 필요하면 `theme.css`의 `:root`와 `.dark` **양쪽**에 토큰을 추가한 뒤 `@theme inline`에 매핑합니다.
- 다크 모드는 `@nuxtjs/color-mode` + `.dark` 클래스 기반(`@custom-variant dark`)입니다.
  예외적인 다크 전용 조정만 `dark:` variant를 씁니다.
- 반경은 `--radius` 기반 유틸(`rounded-xl`, `rounded-2xl`)로 통일합니다.

### 2.3 클래스 작성

- 조건부·병합 클래스는 항상 `cn()` (`app/utils/cn.ts`, `clsx` + `tailwind-merge`)을 씁니다.
  문자열 템플릿으로 클래스를 이어붙이지 마세요.
- 정적 클래스는 `class="..."`, 동적일 때만 `:class="cn(...)"`.
- 클래스 정렬은 oxfmt(`sortTailwindcss`)가 자동 처리합니다. 수동 정렬 금지.
- 인라인 `style`과 스코프드 `<style>`은 최후 수단입니다. 전역 애니메이션/트랜지션은 `main.css`에 둡니다.

### 2.4 컴포넌트 규약

- 파일명은 **kebab-case**, 템플릿에서는 Nuxt 자동 import 이름인 **PascalCase**로 씁니다.
  `app/components/post-card.vue` → `<PostCard />`,
  `app/components/sidebar/category-tree.vue` → `<SidebarCategoryTree />`.
- props는 `defineProps<{ ... }>()` **타입 기반만** 허용됩니다 (`vue/define-props-declaration: type-based`).
  런타임 객체 선언(`defineProps({ post: { type: Object } })`)은 린트 에러입니다.
- 아이콘은 `@nuxt/icon`의 `<Icon name="lucide:calendar" class="size-4" />` 형태로, 인라인 SVG를 붙여넣지 않습니다.
  아이콘 셋: `lucide`, `mdi`, `simple-icons`, `devicon`.
- 이미지는 `<NuxtImg>`, 내부 링크는 `<NuxtLink>`.
- 마크다운 렌더링 요소는 `app/components/prose/prose-*.vue`를 수정합니다.
  본문 스타일을 페이지에서 개별 오버라이드하지 마세요.
- 접근성: 링크/버튼에 `aria-*`(예: 진행 중 상태는 `:aria-busy`), 시간은 `<time :datetime="...">`,
  이미지에는 의미 있는 `alt`를 붙입니다.
- 모바일 우선으로 작성하고 `md:` / `lg:`로 확장합니다.

## 3. 파일 · 모듈 이름

**모든 파일과 디렉터리는 kebab-case입니다.** (`unicorn/filename-case`가 강제)

- `use-post-list.ts`, `format-post-date.ts`, `post-card.vue`, `create-mappers.ts`
- PascalCase 파일명(`PostCard.vue`), snake_case, camelCase 파일명 금지
- 디렉터리도 동일: `app/components/sidebar/`, `src/types/dto/`

프레임워크가 요구하는 형태는 예외로 유지합니다.

- Nuxt 동적 라우트: `app/pages/posts/[idx].vue`, `server/api/author/[nick].get.ts`
- Nitro 메서드 접미사: `posts.get.ts`, 라우트 파일 `rss.xml.ts`
- 루트 관례 파일: `README.md`, `CHANGELOG.md`, `AGENTS.md`, `CLAUDE.md`

파일 내부 식별자 규칙은 별개입니다.

- 변수·함수: camelCase / composable은 `useXxx`
- 타입·인터페이스·컴포넌트 이름: PascalCase
- 상수 맵: camelCase 또는 UPPER_SNAKE (기존 파일의 관례를 따를 것)
- 배럴 파일은 `index.ts`로 두고, 새 모듈은 해당 `index.ts`에 export를 추가합니다.
- 타입 import는 `import type { ... }` 또는 `import { type X }` — `consistent-type-imports`가 강제합니다.

## 4. 린트 · 포맷 규칙

도구는 OXC 하나입니다: **oxlint**(린트) + **oxfmt**(포맷). ESLint/Prettier를 추가하지 마세요.

```bash
pnpm lint
```

```bash
pnpm format
```

설정은 [.oxlintrc.json](.oxlintrc.json), [.oxfmtrc.json](.oxfmtrc.json)에 있습니다.
포맷 핵심: printWidth 100, 2-space, 세미콜론 O, 싱글 쿼트, trailing comma `all`, LF,
`vueIndentScriptAndStyle: true` (Vue의 `<script>`/`<style>` 내부를 한 단계 들여씀).

### 4.1 린트 에러는 끄지 말고 고칩니다

**이 규칙이 가장 중요합니다.** 린트가 에러를 내면 원인을 코드에서 해결하세요.

- `// oxlint-disable`, `// oxlint-disable-next-line`, `.oxlintrc.json`의 규칙 `"off"` 전환은 **기본적으로 금지**입니다.
- `@ts-ignore` / `@ts-expect-error`도 마찬가지입니다. 정말 불가피하면 `ban-ts-comment`가 요구하는
  **10자 이상의 설명**을 반드시 붙입니다.
- `typescript/no-explicit-any`가 걸리면 `any`를 넣지 말고 실제 타입을 정의하거나 `unknown` + 좁히기를 씁니다.
- `no-unused-vars`는 삭제로 해결합니다. `_` 접두사로 숨기는 건 시그니처상 지울 수 없는 인자에만.
- 정말로 규칙을 끄거나 예외를 둬야 한다면, 그건 코드 변경이 아니라 **설정 변경**입니다.
  임의로 커밋하지 말고 이유와 대안을 사용자에게 먼저 설명하고 승인을 받으세요.
- `pnpm lint`는 `--fix`가 붙어 있어 자동 수정 가능한 항목은 알아서 고칩니다.
  실행 후 남은 에러가 진짜 손봐야 할 것들입니다.

### 4.2 자주 걸리는 규칙

- `typescript/no-explicit-any`, `typescript/no-empty-object-type`, `typescript/consistent-type-imports`
- `unicorn/filename-case` (kebab-case / camelCase만 허용)
- `import/first`, `import/no-duplicates`, `import/newline-after-import`, `import/no-mutable-exports`
- `promise/param-names`, `promise/no-return-wrap`
- `vue/*` — `valid-define-props`, `no-side-effects-in-computed-properties`, `prop-name-casing`,
  `require-default-prop`, `no-export-in-script-setup` 등
- TypeScript는 `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` ([tsconfig.base.json](tsconfig.base.json)).
  인덱스 접근 결과는 `undefined`일 수 있으니 `!` 대신 가드를 쓰세요.

## 5. 변경사항 검증

작업을 끝냈다고 보고하기 전에 아래를 **실제로 실행**하고 결과를 확인합니다.
실패하면 실패했다고 그대로 보고하세요.

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

- 순서가 중요합니다. `directus-blog-core`는 `dist`를 통해 소비되므로 **typecheck 전에 반드시 빌드**합니다.
  (CI도 같은 순서입니다 — [.github/workflows/ci.yml](.github/workflows/ci.yml))
- 특정 워크스페이스만 검증할 때는 `pnpm --filter <패키지명> typecheck` 식으로 좁힙니다.
- 앱 UI를 건드렸다면 `pnpm dev`(= `template-blog`) 또는
  `pnpm --filter @croffledev/croffle-blog dev`로 라이트/다크 양쪽을 눈으로 확인합니다.
  `.env`가 필요합니다: `cp apps/template-blog/.env.example apps/template-blog/.env`
- 테스트 러너는 아직 없습니다. 테스트를 새로 도입하려면 먼저 사용자와 합의하세요.
- 커밋 시 husky `pre-commit`이 `pnpm typecheck` + `lint-staged`(oxlint --fix, oxfmt)를 돌립니다.
  훅을 `--no-verify`로 건너뛰지 마세요.

## 6. 커밋 스타일

**Conventional Commits**를 따릅니다. 제목은 소문자, 명령형, 마침표 없음.

```
<type>(<scope>): <subject>
```

- **type**: `feat` · `fix` · `docs` · `chore` · `ci` · `refactor` · `test` · `perf` · `style`
- **scope**(선택): 워크스페이스나 영역 이름 — `core`, `layer`, `template-blog`, `croffle-blog`, `cli`, `release`, `ci`
- **subject**: 무엇이 바뀌는지 한 줄. 영어/한국어 모두 쓰지만 한 커밋 안에서는 섞지 않습니다.

실제 히스토리 예시:

```
feat(core): add GraphQL query builders and pure utils
feat(layer): add Nitro API routes and RSS feed
feat(croffle-blog): configure standalone deploy to Cloudflare Workers
fix(template-blog): restore post detail rendering
fix(ci): build core before typecheck
docs: mark directus-blog-core extraction as done
chore: update deps
```

- 커밋은 논리 단위로 쪼갭니다. 포맷팅만 하는 변경은 기능 변경과 섞지 않습니다.
- 사용자가 요청하지 않았다면 커밋·푸시하지 않습니다.
- `master`에 직접 커밋하지 말고 브랜치를 먼저 만듭니다.

### 6.1 Changesets

`packages/` 아래 **publish 대상 패키지**(`directus-blog-core`, `nuxt-directus-blog`, `create-croffle-blog`)의
동작이 바뀌면 changeset을 함께 추가합니다.

```bash
pnpm changeset
```

- `apps/template-blog`는 changeset 대상에서 제외되어 있습니다 ([.changeset/config.json](.changeset/config.json)).
- 버전 bump/배포는 `Release` 워크플로가 담당합니다. 로컬에서 `pnpm version-packages`나 `pnpm release`를
  임의로 실행하지 마세요.
- semver: 소비자 코드가 깨지면 major, 기능 추가는 minor, 내부 수정은 patch.

## 7. 작업 시 주의

- 비밀값(Directus 토큰, 배포 키)을 코드나 커밋에 넣지 않습니다. 설정은 `.env` / `runtimeConfig`로 주입합니다.
  새 환경변수를 추가하면 `apps/*/.env.example`과 README의 환경변수 표를 함께 갱신합니다.
- 의존성 추가는 최소한으로. 이미 있는 것(`@vueuse/core`, `clsx`, `tailwind-merge`, `@nuxt/icon`)을 먼저 찾아보세요.
- 생성물(`.nuxt`, `.output`, `dist`, `node_modules`)은 편집하지 않습니다.
- `pnpm-lock.yaml`은 손으로 고치지 않습니다. pnpm 명령으로만 갱신합니다.
- 스택이나 규칙 자체를 바꾸는 변경(린트 규칙, 포맷 설정, 툴체인 교체)은 실행 전에 사용자에게 확인받습니다.
