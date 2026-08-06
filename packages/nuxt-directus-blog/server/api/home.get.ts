import type { HomePosts, RawHomePosts } from '@croffledev/directus-blog-core';

export default defineEventHandler(async (): Promise<HomePosts> => {
  const { client, mappers } = useBlogCore();
  const { buildQuery, home } = useQuery();

  try {
    const result = await client.query<RawHomePosts>(buildQuery(home));
    return mappers.home(result);
  } catch (error) {
    console.error('Failed to fetch home:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch home',
    });
  }
});
