import type { PostsResponse, RawCategoryTree, RawPosts } from '@croffledev/directus-blog-core';
import { collectCategorySlugs, decodeRouteSlug } from '@croffledev/directus-blog-core';

export default defineCachedEventHandler(
  async (event): Promise<PostsResponse> => {
    const query = getQuery(event);

    const limit = Math.min(Number(query.limit) || 10, 50);
    const page = Math.max(Number(query.page) || 1, 1);
    const offset = (page - 1) * limit;

    const search = query.search ? decodeRouteSlug(String(query.search)) : undefined;
    const categorySlug = query.category ? decodeRouteSlug(String(query.category)) : undefined;
    const tagSlug = query.tag ? decodeRouteSlug(String(query.tag)) : undefined;
    const seriesSlug = query.series ? decodeRouteSlug(String(query.series)) : undefined;
    const author = query.author ? decodeRouteSlug(String(query.author)) : undefined;

    const searchType: 'search' | 'category' | 'tag' | 'series' | null = (() => {
      if (search) {
        return 'search';
      } else if (categorySlug && !seriesSlug && !tagSlug) {
        return 'category';
      } else if (tagSlug && !seriesSlug && !categorySlug) {
        return 'tag';
      } else if (seriesSlug && !categorySlug && !tagSlug) {
        return 'series';
      } else if (!search && !categorySlug && !tagSlug && !seriesSlug) {
        return null;
      } else {
        return 'search';
      }
    })();

    const { client, mappers } = useBlogCore();
    const { buildQuery, posts, series, category, categoryTree, tag } = useQuery();

    try {
      const categorySlugs = categorySlug
        ? collectCategorySlugs(
            (await client.query<RawCategoryTree>(buildQuery(categoryTree))).categories ?? [],
            categorySlug,
          )
        : undefined;

      const result = await client.query<RawPosts>(
        buildQuery(
          posts({
            limit,
            offset,
            search,
            categories: categorySlugs,
            tag: tagSlug,
            series: seriesSlug,
            author,
          }),
          seriesSlug ? series(seriesSlug) : undefined,
          categorySlug ? category(categorySlug) : undefined,
          tagSlug ? tag(tagSlug) : undefined,
        ),
      );

      const postsData = mappers.post(result.posts);
      const totalCount = Number(result.postsCount?.[0]?.count?.id ?? 0);

      const metadataSource =
        searchType === 'category'
          ? result.categories?.[0]
          : searchType === 'tag'
            ? result.tags?.[0]
            : searchType === 'series'
              ? result.series?.[0]
              : undefined;

      if (
        (searchType === 'category' || searchType === 'tag' || searchType === 'series') &&
        !metadataSource
      ) {
        throw createError({
          statusCode: 404,
          statusMessage: `${searchType} not found`,
        });
      }

      const metadata = metadataSource
        ? {
            ...mappers.postSearch(metadataSource),
            // 상위 카테고리는 posts_func가 직접 연결만 세므로, 자손 포함 집계값으로 덮어씀
            ...(searchType === 'category' ? { totalCount } : {}),
          }
        : undefined;

      return {
        searchType,
        metadata,
        totalCount,
        posts: postsData,
      };
    } catch (error) {
      if (isError(error)) {
        throw error;
      }
      console.error('Failed to fetch posts:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch posts',
      });
    }
  },
  {
    name: 'posts',
    maxAge: 180,
    swr: true,
    getKey: (event) => {
      const q = getQuery(event);
      return [
        `l${q.limit ?? 10}`,
        `p${q.page ?? 1}`,
        q.search ? `s:${q.search}` : '',
        q.category ? `c:${q.category}` : '',
        q.tag ? `t:${q.tag}` : '',
        q.series ? `se:${q.series}` : '',
        q.author ? `a:${q.author}` : '',
      ]
        .filter(Boolean)
        .join('|');
    },
  },
);
