---
'create-croffle-blog': patch
---

Republish so the bundled template picks up the post-detail fixes and the new package
versions.

The template directory is generated from `apps/template-blog` by `prepack`, so it is only
refreshed when this package is actually published. The previous tarball scaffolds a project
whose post detail page does not render — the body used a component name that no longer
exists in `@comark/nuxt`, the canonical redirect looped on non-ASCII slugs, and a
`useSeoMeta` getter called a composable outside `setup()`.

The regenerated template also pins the new major versions of
`@croffledev/directus-blog-core` and `@croffledev/nuxt-directus-blog`.
