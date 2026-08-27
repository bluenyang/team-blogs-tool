---
'@croffledev/directus-blog-core': minor
'@croffledev/nuxt-directus-blog': minor
---

Add author (필진) support: roster, per-author post archive, and a lightweight search endpoint.

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
