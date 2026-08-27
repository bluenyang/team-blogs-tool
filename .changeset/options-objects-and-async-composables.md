---
'@croffledev/directus-blog-core': major
'@croffledev/nuxt-directus-blog': major
---

**Breaking.** Query and composable signatures changed, and two composables are now async.

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
