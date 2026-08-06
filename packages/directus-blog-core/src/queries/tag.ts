export function tagQuery(blogSlug: string, tagSlug: string) {
  return `tags(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      slug: { _eq: "${tagSlug}" }
    }
  ) {
    name
    slug
    posts_func { count }
  }`;
}
