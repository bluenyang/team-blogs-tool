---
description: .ai/ 와 저장소 상태를 읽어 이전 작업 맥락을 복원하고 브리핑한다
argument-hint: '[작업 슬러그 — 특정 작업만 볼 때]'
---

# /spec — 이전 작업 맥락 복원

새 채팅에서 **가장 먼저** 실행하는 커맨드. `.ai/`에 남은 기록과 저장소의 실제 상태를 대조해서
"지금 무슨 작업이 어디까지 되어 있고, 다음에 뭘 해야 하는지"를 복원한다.

입력: `$ARGUMENTS` (특정 작업 슬러그가 오면 그 작업에 한정해서 본다)

## 1. 읽기 순서 — 이 순서대로 읽는다

기록은 `.ai/`에 있고, 진실은 코드와 git에 있다. **`.ai/`는 마지막 세션이 남긴 주장이고, 그 사이에
저장소가 바뀌었을 수 있다.** 항상 2번(기록)과 3번(실제)을 대조한다.

### 1) 규칙 — 무엇을 지켜야 하는지

- [AGENTS.md](../../AGENTS.md) — 작업 규칙 전부(UI 토큰, kebab-case, 린트, 검증 순서, 커밋 스타일).
  `CLAUDE.md`는 `@AGENTS.md` 한 줄이라 자동으로 로드된다.
- [README.md](../../README.md) — 저장소가 뭘 하는 물건인지, 환경변수 표

### 2) 기록 — 마지막 세션이 남긴 것

```bash
ls -la .ai .ai/worklog .ai/specs 2>/dev/null
```

- `.ai/state.md` — **현재 상태 스냅샷.** 없으면 마지막 세션이 `/worklog`를 안 돌린 것이다.
- `.ai/worklog/<날짜>-<슬러그>.md` — 세션별 상세. 최신 것부터 읽고, `상태: 진행중`인 것만 깊게 본다.
- `.ai/specs/<슬러그>.md` — 있으면 그 작업의 요구사항/설계 원본
- `.ai/`가 통째로 없으면 → 기록 없이 시작하는 상황이다. 3번만으로 파악하고, 사용자에게 그 사실을 알린다.

### 3) 실제 — 저장소의 현재 사실

```bash
git branch --show-current && git status --short && git log --oneline -15
```

```bash
git diff --stat && git diff --cached --stat
```

```bash
ls .changeset/*.md 2>/dev/null
```

- 브랜치가 `master`인지 작업 브랜치인지 (AGENTS.md: `master` 직접 커밋 금지)
- 미커밋 변경이 `.ai/state.md`가 말하는 것과 일치하는지
- `.changeset/`에 미배포 changeset이 쌓여 있는지 (= publish 대기 중인 패키지 변경)
- `.ai` 기록보다 최신 커밋이 있으면 **기록이 낡은 것**이다. 커밋 쪽을 믿는다.

### 4) 코드 — 기록에 나온 파일만 실제로 열어본다

worklog의 "변경한 것" 목록에 있는 파일을 직접 읽어서, 적힌 대로 되어 있는지 확인한다.
경로가 바뀌었거나 파일이 사라졌으면 기록이 낡은 것이다.

## 2. 파악에 도움이 되는 저장소 지형

`.ai/`가 비어 있어도 이 정도는 알고 시작한다.

### 무엇이 어디 있나

| 찾는 것                    | 위치                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| 화면·컴포넌트·페이지       | `apps/croffle-blog/app/` (운영), `apps/template-blog/app/` (템플릿) |
| 색·다크모드 토큰           | `apps/*/app/assets/css/theme.css`                                   |
| Directus 쿼리 / 매퍼 / DTO | `packages/directus-blog-core/src/{queries,mappers,types}/`          |
| API 라우트 (Nitro)         | `packages/nuxt-directus-blog/server/api/`                           |
| 데이터 훅 (composable)     | `packages/nuxt-directus-blog/app/composables/`                      |
| 배포 설정                  | `apps/croffle-blog/wrangler.jsonc`, `.github/workflows/release.yml` |
| 린트·포맷 규칙             | `.oxlintrc.json`, `.oxfmtrc.json`                                   |

### 의존 방향 (거꾸로 가지 않는다)

```
apps/croffle-blog ─┐
apps/template-blog ─┴→ nuxt-directus-blog (Layer) → directus-blog-core (dist)
```

- `directus-blog-core`는 `dist`로 소비된다 → **고치면 빌드해야 다른 곳에 반영된다.**
- `apps/template-blog` 수정은 `create-croffle-blog`의 `template/`으로 흘러간다 (prepack 동기화).
  운영 전용 변경은 `apps/croffle-blog`에만.

### 자주 헷갈리는 것

- `apps/croffle-blog`의 패키지 이름은 `@croffledev/team-blog`다 (디렉터리명과 다름).
- `apps/croffle-blog/README.md`는 template-blog 내용이 복사된 낡은 문서다. 배포 절차는 `wrangler.jsonc` 주석을 볼 것.
- 테스트 러너가 없다. "테스트"는 `/test`(= lint → core build → typecheck → build)를 뜻한다.
- `.env`는 gitignore. 앱을 띄우려면 `cp apps/template-blog/.env.example apps/template-blog/.env` 필요.

## 3. 브리핑 출력

읽기가 끝나면 아래 형식으로 **짧게** 정리해서 사용자에게 보고한다. 파일 내용을 그대로 덤프하지 않는다.

```
## 이어서 하던 작업
<슬러그> — <한 줄 요약> (상태: 진행중/검증대기/…)

## 어디까지 됐나
- <완료된 것 2~4줄>

## 기록과 실제의 차이
- <있으면. 없으면 "일치">

## 다음 액션
1. <구체적인 것>
2. <…>

## 확인 필요
- <사용자에게 물어봐야 할 것. 없으면 생략>
```

## 4. 상태가 낡았으면 갱신

`.ai/state.md`가 없거나 실제 저장소 상태와 어긋나면, 지금 파악한 내용으로 `.ai/state.md`를
`/worklog`의 형식에 맞춰 다시 쓴다. **다시 썼다는 사실을 사용자에게 알린다.**

## 5. 규칙

- 브리핑 단계에서 코드를 고치지 않는다. 파악과 보고까지가 이 커맨드의 일이다.
- 기록에 적힌 내용을 검증 없이 사실로 옮기지 않는다. "worklog에는 통과했다고 되어 있음"처럼 출처를 밝힌다.
- 기록이 전혀 없으면 없다고 말한다. 그럴듯하게 지어내지 않는다.
