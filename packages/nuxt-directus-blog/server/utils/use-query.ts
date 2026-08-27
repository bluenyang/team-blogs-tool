import {
  authorProfileQuery,
  authorsQuery,
  buildQuery,
  categoryQuery,
  categoryTreeQuery,
  homeQuery,
  postDetailQuery,
  postSearchQuery,
  postsQuery,
  rssQuery,
  seriesQuery,
  sidebarQuery,
  sitemapQuery,
  tagQuery,
  type AuthorProfileQueryOptions,
  type PostsQueryOptions,
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
    sidebar: (tagLimit?: number) => sidebarQuery(blogSlug, tagLimit),
    home: (limit?: number) => homeQuery(blogSlug, limit),
    postDetail: (postIdx: number) => postDetailQuery(blogSlug, postIdx),
    posts: (options: PostsQueryOptions) => postsQuery(blogSlug, options),
    postSearch: (search: string, limit?: number) => postSearchQuery(blogSlug, search, limit),
    series: (seriesSlug: string) => seriesQuery(blogSlug, seriesSlug),
    sitemap: sitemapQuery(blogSlug),
    rss: rssQuery(blogSlug),
    category: (categorySlug: string) => categoryQuery(blogSlug, categorySlug),
    categoryTree: categoryTreeQuery(blogSlug),
    tag: (tagSlug: string) => tagQuery(blogSlug, tagSlug),
    authors: (withBio?: boolean) => authorsQuery(blogSlug, withBio),
    authorProfile: (options: AuthorProfileQueryOptions) => authorProfileQuery(blogSlug, options),
  };
}
