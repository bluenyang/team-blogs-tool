import {
  buildQuery,
  categoryQuery,
  categoryTreeQuery,
  homeQuery,
  postDetailQuery,
  postsQuery,
  rssQuery,
  seriesQuery,
  sidebarQuery,
  sitemapQuery,
  tagQuery,
} from '@croffledev/directus-blog-core';

/** blogSlug가 바인딩된 GraphQL query helpers */
export function useQuery() {
  const config = useRuntimeConfig();
  const blogSlug = config.public.blogSlug as string;

  if (!blogSlug) {
    throw new Error('[nuxt-directus-blog] runtimeConfig.public.blogSlug is not set');
  }

  return {
    buildQuery,
    sidebar: sidebarQuery(blogSlug),
    home: homeQuery(blogSlug),
    postDetail: (postIdx: number) => postDetailQuery(blogSlug, postIdx),
    posts: (
      limit: number,
      offset: number,
      search?: string,
      categories?: string[],
      tag?: string,
      series?: string,
    ) => postsQuery(blogSlug, limit, offset, search, categories, tag, series),
    series: (seriesSlug: string) => seriesQuery(blogSlug, seriesSlug),
    sitemap: sitemapQuery(blogSlug),
    rss: rssQuery(blogSlug),
    category: (categorySlug: string) => categoryQuery(blogSlug, categorySlug),
    categoryTree: categoryTreeQuery(blogSlug),
    tag: (tagSlug: string) => tagQuery(blogSlug, tagSlug),
  };
}
