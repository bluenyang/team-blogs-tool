---
description: 변경사항을 AGENTS.md §5 순서대로 검증한다 (lint → core build → typecheck → build)
argument-hint: '[all|quick|core|layer|blog|template|ui] (기본: all)'
---

# /test — 변경사항 검증

**이 저장소에는 테스트 러너(vitest/jest 등)가 없다.** 여기서 "테스트"는
[AGENTS.md](../../AGENTS.md) §5의 검증 파이프라인을 뜻한다.
테스트 러너를 새로 도입하는 것은 스택 변경이므로, 사용자와 먼저 합의하기 전에는 설치하지 않는다.

입력: `$ARGUMENTS` (없으면 `all`)

## 실행 순서 — 이 순서를 지킨다

`directus-blog-core`는 `dist`를 통해 소비되므로 **typecheck 전에 반드시 빌드**한다.
CI([.github/workflows/ci.yml](../../.github/workflows/ci.yml))도 같은 순서다.

### `all` (기본)

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

각 단계는 **앞 단계가 통과한 뒤에** 실행한다. 실패하면 거기서 멈추고 고친 뒤 그 단계부터 다시 돈다.
`pnpm build`는 Nuxt 앱 2개를 빌드하므로 수 분 걸린다 — 넉넉한 timeout을 준다.

### `quick`

빠른 피드백용. 커밋 전 최소 확인.

```bash
pnpm lint
```

```bash
pnpm --filter @croffledev/directus-blog-core build && pnpm typecheck
```

`quick`으로 끝냈으면 **`pnpm build`를 안 돌렸다는 사실을 반드시 보고에 명시한다.**

### 워크스페이스 한정

| 인자       | 대상                                          | 명령                                                                                         |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `core`     | `@croffledev/directus-blog-core`              | `pnpm lint` → `pnpm --filter @croffledev/directus-blog-core build`                           |
| `layer`    | `@croffledev/nuxt-directus-blog`              | `pnpm lint` → core build → 소비 앱 typecheck (Layer는 자체 typecheck가 없다)                 |
| `blog`     | `@croffledev/team-blog` (`apps/croffle-blog`) | `pnpm lint` → core build → `pnpm --filter @croffledev/team-blog typecheck` → `... build`     |
| `template` | `@croffledev/template-blog`                   | `pnpm lint` → core build → `pnpm --filter @croffledev/template-blog typecheck` → `... build` |

Layer(`packages/nuxt-directus-blog`)를 고쳤으면 자체 typecheck가 없으므로 **소비 앱 중 하나로 반드시 검증**한다.

### `ui` — 눈으로 확인

UI를 건드린 경우에만. `.env`가 필요하다.

```bash
cp apps/template-blog/.env.example apps/template-blog/.env
```

```bash
pnpm dev
```

운영 블로그는:

```bash
pnpm --filter @croffledev/team-blog dev
```

- **라이트/다크 양쪽**을 확인한다 (`theme.css` 토큰이 양쪽에 다 있는지).
- 모바일 폭(375px)과 데스크톱을 함께 본다.
- 확인이 끝나면 dev 서버를 정리한다.

## 실패했을 때

- **린트 에러는 규칙을 끄지 말고 코드로 고친다.** `oxlint-disable`, `.oxlintrc.json`의 `"off"`,
  `@ts-ignore` 추가는 금지다 (AGENTS.md §4.1). 규칙을 정말 바꿔야 한다면 코드가 아니라 설정 변경이므로
  이유와 대안을 사용자에게 설명하고 승인을 받는다.
- `pnpm lint`는 `--fix`가 붙어 있다. 실행 후 **남은** 에러가 손봐야 할 것들이다.
- typecheck 에러가 `Cannot find module '@croffledev/directus-blog-core'` 류면 core 빌드를 건너뛴 것이다.
- `noUncheckedIndexedAccess`가 켜져 있다. 인덱스 접근 결과는 `!`로 누르지 말고 가드로 좁힌다.

## 보고

**실제로 돌린 것만** 보고한다. 건너뛴 단계는 건너뛰었다고 쓴다.

```
| 단계 | 결과 |
| --- | --- |
| pnpm lint | 통과 |
| core build | 통과 |
| pnpm typecheck | 실패 — <파일:줄> <메시지 요약> |
| pnpm build | 미실행 (typecheck 실패로 중단) |
| 라이트/다크 확인 | 미실행 |
```

실패를 통과로 포장하지 않는다. 고쳤으면 고친 내용을 적고 해당 단계부터 다시 돌린 결과를 함께 보고한다.

검증이 끝나면 `/worklog`로 결과를 기록할지 사용자에게 물어본다.
