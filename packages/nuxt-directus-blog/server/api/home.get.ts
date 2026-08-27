import type { HomePosts, RawHomePosts } from '@croffledev/directus-blog-core';

export default defineCachedEventHandler(
  async (): Promise<HomePosts> => {
    const { client, mappers } = useBlogCore();
    const { buildQuery, home } = useQuery();

    try {
      // 피처드 1편 + 최신 글 그리드 6편
      const result = await client.query<RawHomePosts>(buildQuery(home(7)));
      return mappers.home(result);
    } catch (error) {
      console.error('Failed to fetch home:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch home',
      });
    }
  },
  {
    name: 'home',
    maxAge: 180,
    swr: true,
    getKey: () => 'home',
  },
);
