# @croffledev/nuxt-directus-blog

## 1.0.0

### Major Changes

- e5faa93: **Breaking.** Query and composable signatures changed, and two composables are now async.

  ### `postsQuery` takes an options object

  The positional list had grown to seven arguments and needed one more for the author filter.

  ```diff
  - postsQuery(blogSlug, limit, offset, search, categories, tag, series)
  + postsQuery(blogSlug, { limit, offset, search, categories, tag, series, author })
  ```

  `postsFilter(blogSlug, options)` is exported separately for reuse.

  ### `usePostList` takes a filters object

  ```diff
  - usePostList(limit, page, search, category, tag, series)
  + usePostList(limit, page, { search, category, tag, series, author })
  ```

  ### `usePostDetail` and `useAuthorProfile` are async

  ```diff
  - const { post, pending, error } = usePostDetail(postIdx)
  + const { post, pending, error } = await usePostDetail(postIdx)
  ```

  `useFetch` returns before its data resolves — Nuxt only settles asyncData just before
  render. Without awaiting, `post.value` is `undefined` for the whole of `setup()`, so
  anything reading it there (parsing the body, deciding a 404, canonical redirects) silently
  operated on nothing. Components that only touch the refs in their template are unaffected,
  but any `setup()` that reads the value must await.

  ### `useQuery()` helpers

  `sidebar` and `home` are now functions rather than prebuilt strings:

  ```diff
  - buildQuery(sidebar)
  + buildQuery(sidebar())      // or sidebar(tagLimit)
  - buildQuery(home)
  + buildQuery(home())         // or home(limit)
  ```

  ### `RawPostAuthor.id`

  `RawPostAuthor` now requires `id`, and the post queries select it. It is needed to build a
  profile for an author who has posts on the blog but no `blog_members` row — their byline
  links to `/authors/:nick`, so that page must resolve rather than 404.

### Minor Changes

- e5faa93: Add author (필진) support: roster, per-author post archive, and a lightweight search endpoint.

  **core**

  - `authorsQuery(blogSlug, withBio?)` / `authorProfileQuery(blogSlug, options)` and their mappers
  - `AuthorItem` / `AuthorProfile` / `AuthorTopic` / `AuthorLink` DTOs
  - `postSearchQuery(blogSlug, search, limit?)` + `searchMapper` for command-palette style search
  - `postsQuery` accepts an `author` filter (matches `directus_users.nickname`)
  - `postDetailQuery` also returns the previous/next post, exposed as `PostDetail.prev` / `.next`
  - `homeQuery(blogSlug, limit?)` and `sidebarQuery(blogSlug, tagLimit?)` take limits.
    The sidebar tag limit now defaults to 200 instead of a hard-coded 20, so a tag cloud
    can render every tag.

  **layer**

  - `GET /api/authors`, `GET /api/author/:nick`, `GET /api/search`
  - `useAuthors()`, `useAuthorProfile()`, `usePostSearch()`
  - `GET /api/posts` accepts `author`
  - the sitemap source adds author pages (only authors with published posts) and the
    `/posts`, `/series`, `/tags`, `/authors` index pages

  Roster membership comes from `blog_members` only. `homepage_team_members` is joined in
  purely to fill in real names and social links — it has no blog scope, so treating it as a
  membership source would list people who have nothing to do with the blog.

  `blog_members.bio` is optional: the layer probes for it once and falls back to querying
  without it, so this works whether or not the field exists in Directus yet.

### Patch Changes

- e5faa93: Cache every API route with `defineCachedEventHandler` (SWR), so repeated requests stop
  reaching Directus.

  `/api/sidebar` and `/api/authors` cache for 10 minutes, `/api/post/:idx` for 5, the post and
  author lists for 3, and `/api/search` for 2. Cache keys include the query parameters that
  change the response.

  Note for local development: these results persist in `.nuxt/cache`. If a mapper or query
  edit appears to have no effect, clear that directory.

- Updated dependencies [e5faa93]
- Updated dependencies [e5faa93]
- Updated dependencies [e5faa93]
  - @croffledev/directus-blog-core@1.0.0

## 0.1.0

### Minor Changes

- set version

### Patch Changes

- Updated dependencies
  - @croffledev/directus-blog-core@0.1.0
