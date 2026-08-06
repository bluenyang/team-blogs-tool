# create-croffle-blog

Croffle Directus Nuxt 블로그 스캐폴드 CLI입니다.

## 사용

```bash
pnpm create croffle-blog my-blog
# 또는
npx create-croffle-blog my-blog
```

옵션:

```bash
create-croffle-blog my-blog --packageManager pnpm
create-croffle-blog my-blog --no-install
create-croffle-blog my-blog --template ./path/to/template
create-croffle-blog my-blog --force
```

## 모노레포에서 개발

```bash
pnpm --filter create-croffle-blog sync-template
pnpm --filter create-croffle-blog exec create-croffle-blog ../../tmp-blog --no-install
```

`prepack`에서 `apps/template-blog` → `template/`로 동기화한 뒤 publish합니다.
