import type { PostDetail, RawPostDetail } from '@croffledev/directus-blog-core';

export default defineCachedEventHandler(
  async (event): Promise<PostDetail> => {
    const postIdx = Number(getRouterParam(event, 'idx'));

    if (!Number.isInteger(postIdx) || postIdx < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid post index',
      });
    }

    const { client, mappers } = useBlogCore();
    const { buildQuery, postDetail } = useQuery();

    try {
      const result = await client.query<RawPostDetail>(buildQuery(postDetail(postIdx)));

      if (!result.posts?.length) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' });
      }

      return mappers.postDetail(result);
    } catch (error) {
      if (isError(error)) {
        throw error;
      }
      console.error('Failed to fetch post detail:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch post detail',
      });
    }
  },
  {
    name: 'post',
    maxAge: 300,
    swr: true,
    getKey: (event) => String(getRouterParam(event, 'idx') ?? ''),
  },
);
