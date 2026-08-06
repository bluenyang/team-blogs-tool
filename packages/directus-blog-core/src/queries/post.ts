export function postDetailQuery(blogSlug: string, postIdx: number) {
  return `posts(
    filter: {
      blog_id: { slug: { _eq: "${blogSlug}" } }
      post_idx: { _eq: "${postIdx}" }
      status: { _eq: "published" }
    }
    sort: ["published_at"]
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
    content
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
        posts_func { count }
        posts {
          posts_id {
            post_idx
            title
            slug
          }
        }
      }
    }
  }`;
}

export function postsQuery(
  blogSlug: string,
  limit: number,
  offset: number,
  search?: string,
  categories?: string[],
  tag?: string,
  series?: string,
) {
  const filter = `
    blog_id: { slug: { _eq: "${blogSlug}" } }
    status: { _eq: "published" }
    ${search ? `_or: [{ title: { _contains: "${search}" } }, { summary: { _contains: "${search}" } }, { content: { _contains: "${search}" } }]` : ''}
    ${categories?.length ? `categories: { categories_id: { slug: { _in: ${JSON.stringify(categories)} } } }` : ''}
    ${tag ? `tags: { tags_id: { slug: { _eq: "${tag}" } } }` : ''}
    ${series ? `series: { series_id: { slug: { _eq: "${series}" } } }` : ''}
  `;

  return `posts(
    sort: ["-published_at"]
    filter: { ${filter} }
    limit: ${limit}
    offset: ${offset}
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
  postsCount: posts_aggregated(
    filter: { ${filter} }
  ) {
    count { id }
  }`;
}
