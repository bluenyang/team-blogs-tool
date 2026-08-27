---
'@croffledev/nuxt-directus-blog': patch
---

Cache every API route with `defineCachedEventHandler` (SWR), so repeated requests stop
reaching Directus.

`/api/sidebar` and `/api/authors` cache for 10 minutes, `/api/post/:idx` for 5, the post and
author lists for 3, and `/api/search` for 2. Cache keys include the query parameters that
change the response.

Note for local development: these results persist in `.nuxt/cache`. If a mapper or query
edit appears to have no effect, clear that directory.
