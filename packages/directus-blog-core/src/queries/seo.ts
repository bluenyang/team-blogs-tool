export function sitemapQuery(blogSlug: string) {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      status: { _eq: "published" }
    }
    limit: -1
  ) {
    post_idx
    slug
  }
  categories(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
    }
    limit: -1
  ) {
    slug
  }
  tags(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
    }
    limit: -1
  ) {
    slug
  }
  series(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
    }
    limit: -1
  ) {
    slug
  }`;
}

export function rssQuery(blogSlug: string) {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      status: { _eq: "published" }
    }
    limit: 50
  ) {
    author_id {
      first_name
      last_name
      nickname
    }
    id
    post_idx
    title
    slug
    summary
    content
    published_at
  }`;
}
