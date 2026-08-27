import type { RawSearchPosts, SearchResponse } from '@croffledev/directus-blog-core';
import { decodeRouteSlug } from '@croffledev/directus-blog-core';

/**
 * ⌘K 팔레트 전용 경량 검색.
 * /api/posts와 달리 총계 집계를 돌리지 않아, 키 입력마다 도는 쿼리 비용이 절반이다.
 */
export default defineCachedEventHandler(
  async (event): Promise<SearchResponse> => {
    const query = getQuery(event);
    const search = decodeRouteSlug(String(query.q ?? query.search ?? '')).trim();
    const limit = Math.min(Number(query.limit) || 8, 20);

    if (search.length < 2) {
      return { query: search, posts: [] };
    }

    const { client, mappers } = useBlogCore();
    const { buildQuery, postSearch } = useQuery();

    try {
      const result = await client.query<RawSearchPosts>(buildQuery(postSearch(search, limit)));
      return { query: search, posts: mappers.search(result) };
    } catch (error) {
      console.error('Failed to search posts:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to search posts',
      });
    }
  },
  {
    name: 'search',
    maxAge: 120,
    swr: true,
    getKey: (event) => {
      const query = getQuery(event);
      return `${String(query.q ?? query.search ?? '')}|${query.limit ?? 8}`;
    },
  },
);
