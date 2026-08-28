# 기여 가이드

`@croffledev/blogs`에 기여해 주셔서 고맙습니다. 이 문서는 **사람이 PR을 올릴 때 필요한 절차**를 다룹니다.
코드 스타일·네이밍·린트 규칙 같은 세부 규약은 [AGENTS.md](AGENTS.md)에 있으니 작업 전에 한 번 읽어 주세요.

## 준비

Node `>=22`가 필요하고, 패키지 매니저는 **pnpm workspaces 고정**입니다. `npm` / `yarn`을 쓰지 마세요.

```bash
corepack enable
pnpm install
cp apps/template-blog/.env.example apps/template-blog/.env
pnpm dev
```

`pnpm dev`는 `apps/template-blog`를 띄웁니다. 운영 블로그를 보려면
`pnpm --filter @croffledev/croffle-blog dev`를 쓰세요.

## 어디를 고쳐야 하나

```
apps/croffle-blog/          # 운영 블로그 (private)
apps/template-blog/         # 팀원용 Nuxt 스캐폴드 — CLI 템플릿의 원본
packages/directus-blog-core/    # GraphQL query · mapper · DTO 타입
packages/nuxt-directus-blog/    # Nuxt Layer — Nitro API + composables
packages/create-croffle-blog/   # 스캐폴딩 CLI
```

- 앱 두 곳에 같은 로직을 복붙하지 말고 `packages/`로 올립니다.
  데이터 페칭/타입은 `directus-blog-core`, Nuxt 런타임은 `nuxt-directus-blog` Layer가 정착지입니다.
- `apps/template-blog`를 고치면 `create-croffle-blog`의 `template/`이 `prepack` 시 동기화됩니다.
  템플릿에 들어가면 안 되는 변경(운영 전용 값 등)은 `apps/croffle-blog`에만 넣으세요.

## 브랜치와 커밋

- `master`에 직접 커밋하지 말고 브랜치를 먼저 만듭니다.
- **Conventional Commits**를 따릅니다. 제목은 소문자, 명령형, 마침표 없음.

```
<type>(<scope>): <subject>
```

- **type**: `feat` · `fix` · `docs` · `chore` · `ci` · `refactor` · `test` · `perf` · `style`
- **scope**(선택): `core` · `layer` · `cli` · `template-blog` · `croffle-blog` · `release` · `ci`
- 커밋은 논리 단위로 쪼갭니다. 포맷팅만 하는 변경은 기능 변경과 섞지 않습니다.

```
feat(core): add GraphQL query builders and pure utils
fix(ci): build core before typecheck
docs: mark directus-blog-core extraction as done
```

## 검증 — PR 올리기 전에 실제로 돌려보기

순서가 중요합니다. `directus-blog-core`는 `dist`를 통해 소비되므로 **typecheck 전에 반드시 빌드**합니다.
CI([.github/workflows/ci.yml](.github/workflows/ci.yml))도 같은 순서입니다.

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

UI를 건드렸다면 개발 서버를 띄워 **라이트/다크 양쪽**을 눈으로 확인해 주세요.

커밋하면 husky `pre-commit`이 `pnpm typecheck` + `lint-staged`(oxlint --fix, oxfmt)를 돌립니다.
`--no-verify`로 훅을 건너뛰지 마세요.

### 린트 에러는 끄지 말고 고칩니다

`// oxlint-disable`, `.oxlintrc.json`의 규칙 `"off"` 전환, `@ts-ignore`는 **기본적으로 금지**입니다.
규칙 자체를 바꿔야 한다고 판단되면 그건 코드 변경이 아니라 설정 변경이니, PR에 이유와 대안을 적고
메인테이너와 먼저 합의해 주세요.

## Changesets

`packages/` 아래 **배포 대상 패키지**(`directus-blog-core`, `nuxt-directus-blog`, `create-croffle-blog`)의
동작이 바뀌면 changeset을 함께 커밋합니다.

```bash
pnpm changeset
```

- semver: 소비자 코드가 깨지면 major, 기능 추가는 minor, 내부 수정은 patch.
- `apps/template-blog`는 changeset 대상에서 제외돼 있습니다.
- 버전 bump와 배포는 `Release` 워크플로가 담당합니다.
  로컬에서 `pnpm version-packages`나 `pnpm release`를 임의로 실행하지 마세요.

## Pull Request

- PR 제목도 Conventional Commits 형식으로 적어 주세요.
- 무엇을·왜 바꿨는지, 어떻게 확인했는지를 본문에 적습니다. UI 변경이면 스크린샷(라이트/다크)을 첨부해 주세요.
- 라벨은 [.github/labeler.yml](.github/labeler.yml)이 변경 경로를 보고 자동으로 붙입니다.
- [.github/CODEOWNERS](.github/CODEOWNERS)에 따라 리뷰어가 자동 지정됩니다.
- 아래 검사가 모두 통과해야 머지할 수 있습니다.
  - `CI` — lint · core build · typecheck · build
  - `Secret Scan` — TruffleHog 시크릿 스캔
  - `Labeler` — 경로 기반 라벨링

## 비밀값

- Directus 토큰, 배포 키 같은 비밀값을 코드나 커밋에 넣지 마세요. `.env` / `runtimeConfig`로 주입합니다.
- 새 환경변수를 추가하면 `apps/*/.env.example`과 [README.md](README.md)의 환경변수 표를 함께 갱신합니다.
- `Secret Scan` 워크플로(TruffleHog)가 PR과 매주 전체 히스토리를 훑습니다.
  **이미 푸시된 비밀값은 무효화(rotate)가 먼저입니다.** 커밋을 지우는 것만으로는 유출이 되돌려지지 않습니다.
- 비밀값이 노출된 것을 발견했다면 공개 이슈로 올리지 말고 메인테이너에게 비공개로 알려 주세요.

## 그 밖에

- 의존성 추가는 최소한으로. 이미 있는 것(`@vueuse/core`, `clsx`, `tailwind-merge`, `@nuxt/icon`)을 먼저 찾아보세요.
- 생성물(`.nuxt`, `.output`, `dist`, `node_modules`)은 편집하지 않습니다.
- `pnpm-lock.yaml`은 손으로 고치지 않습니다. pnpm 명령으로만 갱신합니다.
- 테스트 러너는 아직 없습니다. 테스트를 도입하려면 먼저 메인테이너와 합의해 주세요.

## 라이선스

기여한 코드는 [MIT License](LICENSE) 아래 배포되는 데 동의하는 것으로 봅니다.
