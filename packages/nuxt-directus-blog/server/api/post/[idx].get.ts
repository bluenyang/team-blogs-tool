import type { PostDetail, RawPostDetail } from '@croffledev/directus-blog-core';

export default defineEventHandler(async (event): Promise<PostDetail> => {
  const postIdx = Number(getRouterParam(event, 'idx'));

  const { client, mappers } = useBlogCore();
  const { buildQuery, postDetail } = useQuery();

  if (Number.isNaN(postIdx)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post index',
    });
  }

  try {
    const result = await client.query<RawPostDetail>(buildQuery(postDetail(postIdx)));
    return mappers.postDetail(result);
  } catch (error) {
    console.error('Failed to fetch post detail:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post detail',
    });
  }
});
