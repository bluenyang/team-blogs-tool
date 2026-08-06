export function homeQuery(blogSlug: string) {
  return `homePosts: posts(
    sort: ["-published_at", "-updated_at"]
    limit: 6
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      status: { _eq: "published" }
    }
  ) {
    author_id {
      first_name
      last_name
      avatar { id }
      nickname
    }
    post_idx
    title
    slug
    summary
    thumbnail { id }
    published_at
    updated_at
    categories {
      categories_id {
        name
        slug
      }
    }
    tags {
      tags_id {
        name
        slug
      }
    }
    series {
      series_id {
        name
        slug
      }
    }
  }
  homeSeries: series(
    sort: ["slug"]
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
    }
  ) {
    name
    description
    slug
    posts_func { count }
  }`;
}
