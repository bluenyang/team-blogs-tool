---
'@croffledev/directus-blog-core': patch
---

Escape interpolated values in GraphQL query strings.

Queries are assembled as template strings, so a search term, slug or nickname went in
verbatim. A single `"` in a search term broke the whole document — which a search-as-you-type
UI hits immediately. All interpolated values now go through the new `gqlString()` /
`gqlStringList()` helpers (also exported as `escapeGraphQLString`).
