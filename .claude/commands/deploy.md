---
description: 배포한다 — blog(team-blog를 master에 푸시) 또는 packages(changeset으로 npm 배포)
argument-hint: 'blog | packages'
---

# /deploy — 배포

배포는 **되돌리기 어렵고 외부에 나가는 작업**이다. 어떤 모드든 실제로 푸시/배포하기 전에
무엇이 나가는지 사용자에게 보여주고 **명시적인 승인을 받는다.** 승인 없이 push·publish하지 않는다.

입력: `$ARGUMENTS` — `blog` 또는 `packages`. 없으면 무엇을 배포할지 먼저 물어본다.

---

## 공통 선행 조건

두 모드 모두, 배포 전에 검증이 통과해야 한다.

```bash
pnpm lint && pnpm --filter @croffledev/directus-blog-core build && pnpm typecheck && pnpm build
```

`/test all`을 이미 통과시켰으면 다시 돌리지 않아도 된다 — 다만 **그 이후에 코드가 바뀌지 않았어야 한다.**
`git status`로 확인한다. 검증이 실패한 상태로는 배포하지 않는다.

```bash
git status --short && git branch --show-current && git log --oneline -10
```

---

## 모드 1: `blog` — 운영 블로그 배포 (master 푸시)

대상: `apps/croffle-blog` (패키지명 `@croffledev/team-blog`) → Cloudflare Workers.

### 1) 나갈 내용 확인

```bash
git log --oneline origin/master..HEAD
```

```bash
git diff origin/master --stat
```

### 2) 커밋

- AGENTS.md §6: Conventional Commits, 소문자 명령형. scope는 `croffle-blog`.
- **`master`에 직접 커밋하지 않는다.** 작업 브랜치에서 커밋하고 master로 합친다.
- husky `pre-commit`이 `pnpm typecheck` + lint-staged를 돌린다. `--no-verify`로 건너뛰지 않는다.

```
feat(croffle-blog): <무엇이 바뀌는지>
```

### 3) 사용자 승인

푸시 직전에 아래를 보여주고 승인을 받는다.

- 나갈 커밋 목록
- 변경 파일 요약
- **경고: `master` 푸시는 `Release` 워크플로도 함께 트리거한다**
  ([.github/workflows/release.yml](../../.github/workflows/release.yml)).
  `.changeset/`에 미배포 changeset이 쌓여 있으면 Version PR이 열리거나 npm publish가 돌 수 있다.
  블로그만 내보내려는 상황이면 이 사실을 사용자에게 반드시 알린다.

```bash
ls .changeset/*.md 2>/dev/null
```

### 4) 푸시

승인을 받은 뒤에만:

```bash
git push origin master
```

### 5) 확인

- GitHub Actions의 `CI` / `Release` 워크플로 결과
- Cloudflare Workers 배포 결과 (워커 이름 `croffle-blog`, [wrangler.jsonc](../../apps/croffle-blog/wrangler.jsonc))
- 배포된 사이트에서 라이트/다크와 글 상세 페이지가 뜨는지

### 수동 배포 (푸시 배포가 막혔을 때만)

```bash
pnpm --filter @croffledev/team-blog deploy
```

- 이건 `build:cloudflare` + `wrangler deploy`다. wrangler 로그인이 필요하고, **사용자가 직접 실행하는 편이 안전하다.**
- 함정: `runtimeConfig.public`(BLOG_URL, DIRECTUS_URL 등)은 **빌드 시점에 굳는다.**
  `apps/croffle-blog/.env`가 운영 값으로 채워져 있지 않으면 잘못된 값이 그대로 박힌 채 배포된다.
  빌드 전에 `.env`를 확인한다. `.env` 실값을 로그나 문서에 남기지 않는다.

---

## 모드 2: `packages` — 도구 배포 (Changesets → npm)

대상: publish 패키지 3개 — `@croffledev/directus-blog-core`, `@croffledev/nuxt-directus-blog`,
`create-croffle-blog`. (`apps/template-blog`는 changeset 대상에서 제외되어 있다.)

### 1) changeset이 있는지 확인

```bash
ls .changeset/*.md 2>/dev/null && cat .changeset/*.md 2>/dev/null
```

패키지 동작이 바뀌었는데 changeset이 없으면 먼저 만든다:

```bash
pnpm changeset
```

- semver: 소비자 코드가 깨지면 major, 기능 추가는 minor, 내부 수정은 patch.
- 요약문은 changelog에 그대로 실린다 — 소비자가 읽을 문장으로 쓴다.
- 커밋: `chore: add changeset for <내용>`

### 2) 배포 경로 — 로컬에서 publish하지 않는다

버전 bump와 publish는 `Release` 워크플로가 한다 (npm Trusted Publishing / OIDC).

- **`pnpm version-packages`와 `pnpm release`를 로컬에서 임의로 실행하지 않는다** (AGENTS.md §6.1).
- 흐름: changeset 커밋 → master 푸시 → Release 워크플로가 **`ci: version packages` PR**을 연다
  → 그 PR을 머지하면 → Release가 다시 돌며 npm에 publish한다.
- 즉 `packages` 모드에서 에이전트가 하는 일은 **changeset 정리 + master 푸시 + PR 안내**까지다.

### 3) 사용자 승인 후 푸시

- 어떤 패키지가 어떤 bump로 나가는지 (major/minor/patch) 정리해서 보여준다.
- 승인 후 `git push origin master`.

### 4) 확인 및 안내

- Release 워크플로가 연 `ci: version packages` PR을 사용자에게 알린다. **PR 머지는 사용자가 판단한다.**
- 머지 후 npm에 버전이 올라갔는지, `packages/*/CHANGELOG.md`가 갱신됐는지 확인한다.
- `create-croffle-blog`는 `prepack`에서 `apps/template-blog`를 `template/`으로 동기화한다.
  template-blog 변경이 함께 나가는 게 맞는지 배포 전에 확인한다.

---

## 하지 않는 것

- 승인 없이 `git push`, `wrangler deploy`, `changeset publish`
- `--no-verify`로 훅 건너뛰기, `--force` 푸시
- 검증 실패 상태에서의 배포
- 토큰·배포 키·`.env` 실값을 코드·커밋·로그에 남기기

배포가 끝나면 `/worklog`로 무엇을 언제 배포했는지 기록한다.
