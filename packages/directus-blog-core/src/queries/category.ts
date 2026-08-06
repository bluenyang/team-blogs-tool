export function categoryQuery(blogSlug: string, categorySlug: string) {
  return `categories(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      slug: { _eq: "${categorySlug}" }
    }
  ) {
    name
    slug
    posts_func { count }
  }`;
}

export function categoryTreeQuery(blogSlug: string) {
  return `categories(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
    }
  ) {
    slug
    parent_id { slug }
  }`;
}
