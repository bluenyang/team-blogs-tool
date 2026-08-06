# template-blog

팀원용 Nuxt 블로그 스캐폴드입니다. `@croffledev/nuxt-directus-blog` Layer로 CMS API를 쓰고,
브랜드/프로필만 env로 주입합니다.

## 로컬 (모노레포)

```bash
cp apps/template-blog/.env.example apps/template-blog/.env
# .env 값 채우기
pnpm install
pnpm dev
```

## CLI로 새 프로젝트 만들기

패키지 publish 후:

```bash
pnpm create croffle-blog my-blog
# 또는
npx create-croffle-blog my-blog
```

생성 후:

```bash
cd my-blog
cp .env.example .env
pnpm install
pnpm dev
```
