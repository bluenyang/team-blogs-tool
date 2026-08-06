import type { RawSidebarContent, SidebarContent } from '@croffledev/directus-blog-core';

export default defineEventHandler(async (): Promise<SidebarContent> => {
  const { client, mappers } = useBlogCore();
  const { buildQuery, sidebar } = useQuery();

  try {
    const result = await client.query<RawSidebarContent>(buildQuery(sidebar));
    return mappers.sidebar(result);
  } catch (error) {
    console.error('Failed to fetch sidebar:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sidebar',
    });
  }
});
