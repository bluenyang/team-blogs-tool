import type { AuthorItem, RawAuthors } from '@croffledev/directus-blog-core';

/**
 * 필진 로스터.
 * 홈 "필진" 섹션과 /authors 목록이 함께 쓰며, 거의 변하지 않으므로 길게 캐시한다.
 */
export default defineCachedEventHandler(
  async (): Promise<AuthorItem[]> => {
    const { client, mappers } = useBlogCore();
    const { buildQuery, authors } = useQuery();

    try {
      const result = await queryWithOptionalBio<RawAuthors>((withBio) =>
        client.query<RawAuthors>(buildQuery(authors(withBio))),
      );
      return mappers.authors(result);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch authors',
      });
    }
  },
  {
    name: 'authors',
    maxAge: 600,
    swr: true,
    getKey: () => 'authors',
  },
);
