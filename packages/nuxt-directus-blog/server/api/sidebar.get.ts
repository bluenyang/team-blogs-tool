import type { RawSidebarContent, SidebarContent } from '@croffledev/directus-blog-core';

/** 모든 페이지가 쓰는 내비게이션 payload — 변동이 적어 길게 캐시한다. */
export default defineCachedEventHandler(
  async (): Promise<SidebarContent> => {
    const { client, mappers } = useBlogCore();
    const { buildQuery, sidebar } = useQuery();

    try {
      // 태그 클라우드(/tags)가 전체 태그를 쓰므로 상한을 넉넉히 잡는다
      const result = await client.query<RawSidebarContent>(buildQuery(sidebar(200)));
      return mappers.sidebar(result);
    } catch (error) {
      console.error('Failed to fetch sidebar:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch sidebar',
      });
    }
  },
  {
    name: 'sidebar',
    maxAge: 600,
    swr: true,
    getKey: () => 'sidebar',
  },
);
