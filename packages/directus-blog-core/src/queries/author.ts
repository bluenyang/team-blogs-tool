import { gqlString } from '../utils/graphql.js';
import { POST_LIST_FIELDS } from './post.js';

const AUTHOR_USER_FIELDS = `user_id {
      id
      nickname
      first_name
      last_name
      avatar { id }
    }`;

/**
 * 필진 로스터.
 *
 * 세 소스를 한 문서에서 가져와 서버에서 조인한다.
 * - blog_members  : 이 블로그의 역할(role)과 소개(bio)
 * - homepage_team_members : 팀 공통 프로필(실명·소셜 링크·정렬 순서)
 * - posts_aggregated(groupBy author_id) : 저자별 글 수를 N+1 없이 한 번에
 *
 * `withBio`는 Directus에 blog_members.bio 필드가 아직 없을 때를 위한 폴백 스위치다.
 * 없는 필드를 요청하면 GraphQL이 문서 전체를 거절하므로, 호출부에서 true → false로 재시도한다.
 */
export function authorsQuery(blogSlug: string, withBio = true) {
  return `blogMembers: blog_members(
    filter: { blog_id: { slug: { _eq: ${gqlString(blogSlug)} } } }
  ) {
    id
    role
    ${withBio ? 'bio' : ''}
    ${AUTHOR_USER_FIELDS}
  }
  teamProfiles: homepage_team_members(
    filter: { status: { _eq: "published" } }
    sort: ["sort", "nickname"]
  ) {
    nickname
    name
    github_username
    email
    linkedin
    homepage
    blog
    ${AUTHOR_USER_FIELDS}
  }
  authorPostCounts: posts_aggregated(
    groupBy: ["author_id"]
    filter: {
      blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
    }
  ) {
    group
    count { id }
  }`;
}

export interface AuthorProfileQueryOptions {
  nickname: string;
  limit: number;
  offset: number;
  /** 주제 분포 집계에 쓸 최대 글 수 (카테고리는 M2M이라 groupBy가 안 되어 앱에서 집계) */
  topicSampleSize?: number;
}

/**
 * 저자 한 명의 글 아카이브.
 * authorsQuery와 같은 문서에 합쳐 보내면 /authors/:nick 전체가 Directus 왕복 1회로 끝난다.
 */
export function authorProfileQuery(blogSlug: string, options: AuthorProfileQueryOptions) {
  const { nickname, limit, offset, topicSampleSize = 200 } = options;

  const filter = `blog_id: { slug: { _eq: ${gqlString(blogSlug)} } }
      status: { _eq: "published" }
      author_id: { nickname: { _eq: ${gqlString(nickname)} } }`;

  return `authorPosts: posts(
    sort: ["-published_at"]
    filter: { ${filter} }
    limit: ${limit}
    offset: ${offset}
  ) {
    ${POST_LIST_FIELDS}
  }
  authorPostsCount: posts_aggregated(
    filter: { ${filter} }
  ) {
    count { id }
  }
  authorTopics: posts(
    filter: { ${filter} }
    limit: ${topicSampleSize}
  ) {
    categories {
      categories_id {
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
  }`;
}
