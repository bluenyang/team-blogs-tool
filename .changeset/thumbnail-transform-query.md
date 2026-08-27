---
'@croffledev/directus-blog-core': patch
---

Post list thumbnails, detail covers, and search-metadata (series/category/tag) thumbnails
now carry a Directus transform query (width/format/quality) baked into the URL, matching
what author avatars already did. Previously these were the raw, untransformed asset URL,
relying on the consuming app's image component to resize them client- or server-side.
