import { gqlString, gqlStringList } from '../utils/graphql.js';

/** 목록용 post selection — content는 응답 크기 때문에 의도적으로 제외한다. */
export const POST_LIST_FIELDS = `author_id {
      id
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
    }`;

export function postDetailQuery(blogSlug: string, postIdx: number) {
  const blogFilter = `blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }`;

  return `posts(
    filter: {
      ${blogFilter}
      post_idx: { _eq: ${postIdx} }
    }
    sort: ["published_at"]
  ) {
    author_id {
      id
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
  }
  prevPost: posts(
    filter: {
      ${blogFilter}
      post_idx: { _lt: ${postIdx} }
    }
    sort: ["-post_idx"]
    limit: 1
  ) {
    post_idx
    title
    slug
  }
  nextPost: posts(
    filter: {
      ${blogFilter}
      post_idx: { _gt: ${postIdx} }
    }
    sort: ["post_idx"]
    limit: 1
  ) {
    post_idx
    title
    slug
  }`;
}

export interface PostsQueryOptions {
  limit: number;
  offset: number;
  search?: string;
  categories?: string[];
  tag?: string;
  series?: string;
  /** directus_users.nickname 기준 저자 필터 */
  author?: string;
}

/** posts / posts_aggregated 공용 filter 블록 */
export function postsFilter(
  blogSlug: string,
  options: Omit<PostsQueryOptions, 'limit' | 'offset'>,
) {
  const { search, categories, tag, series, author } = options;

  return [
    `blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }`,
    `status: { _eq: "published" }`,
    search
      ? `_or: [{ title: { _contains: ${gqlString(search)} } }, { summary: { _contains: ${gqlString(search)} } }, { content: { _contains: ${gqlString(search)} } }]`
      : '',
    categories?.length
      ? `categories: { categories_id: { slug: { _in: ${gqlStringList(categories)} } } }`
      : '',
    tag ? `tags: { tags_id: { slug: { _eq: ${gqlString(tag)} } } }` : '',
    series ? `series: { series_id: { slug: { _eq: ${gqlString(series)} } } }` : '',
    author ? `author_id: { nickname: { _eq: ${gqlString(author)} } }` : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}

export function postsQuery(blogSlug: string, options: PostsQueryOptions) {
  const { limit, offset, ...filterOptions } = options;
  const filter = postsFilter(blogSlug, filterOptions);

  return `posts(
    sort: ["-published_at"]
    filter: { ${filter} }
    limit: ${limit}
    offset: ${offset}
  ) {
    ${POST_LIST_FIELDS}
  }
  postsCount: posts_aggregated(
    filter: { ${filter} }
  ) {
    count { id }
  }`;
}

/**
 * ⌘K 팔레트 전용 경량 검색.
 * 총계 집계를 생략하고 요약·썸네일만 가져와, 키 입력마다 도는 쿼리 비용을 낮춘다.
 */
export function postSearchQuery(blogSlug: string, search: string, limit = 8) {
  const filter = postsFilter(blogSlug, { search });

  return `searchPosts: posts(
    sort: ["-published_at"]
    filter: { ${filter} }
    limit: ${limit}
  ) {
    post_idx
    title
    slug
    summary
    thumbnail { id }
    published_at
    categories {
      categories_id {
        name
        slug
      }
    }
    author_id { nickname }
  }`;
}
