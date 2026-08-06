export function seriesQuery(blogSlug: string, seriesSlug: string) {
  return `series(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      slug: { _eq: "${seriesSlug}" }
    }
  ) {
    name
    slug
    description
    thumbnail { id }
    posts_func { count }
  }`;
}
