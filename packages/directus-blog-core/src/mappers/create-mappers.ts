import type { AssetUrlResolver } from '../asset-url.js';
import type { RawAuthorProfile, RawAuthors } from '../types/raw/author.js';
import type { RawHomePosts } from '../types/raw/home.js';
import type { RawPostDetail, RawPostItem } from '../types/raw/post.js';
import type { RawCategoryItem } from '../types/raw/category.js';
import type { RawSearchPosts } from '../types/raw/search.js';
import type { RawSeriesItem } from '../types/raw/series.js';
import type { RawTagItem } from '../types/raw/tag.js';
import type { RawSidebarContent } from '../types/raw/sidebar.js';

import { authorProfileMapper, authorsMapper } from './author.js';
import { calculatePostCount, categoryInPostMapper, categoryMapper } from './category.js';
import { homeMapper } from './home.js';
import { navigationMapper } from './navigation.js';
import { postDetailMapper, postMapper, postSearchMapper } from './post.js';
import { rssMapper, sitemapMapper } from './seo.js';
import { searchMapper } from './search.js';
import { seriesInPostMapper, seriesMapper } from './series.js';
import { sidebarMapper } from './sidebar.js';
import { tagInPostMapper, tagMapper } from './tag.js';

export type BlogMappers = {
  category: typeof categoryMapper;
  categoryInPost: typeof categoryInPostMapper;
  calculatePostCount: typeof calculatePostCount;
  navigation: typeof navigationMapper;
  tag: typeof tagMapper;
  tagInPost: typeof tagInPostMapper;
  seriesInPost: typeof seriesInPostMapper;
  sitemap: typeof sitemapMapper;
  rss: typeof rssMapper;
  series: (raw: RawSeriesItem[]) => ReturnType<typeof seriesMapper>;
  post: (raw: RawPostItem[]) => ReturnType<typeof postMapper>;
  postDetail: (raw: RawPostDetail) => ReturnType<typeof postDetailMapper>;
  postSearch: (
    raw: RawCategoryItem | RawSeriesItem | RawTagItem,
  ) => ReturnType<typeof postSearchMapper>;
  home: (raw: RawHomePosts) => ReturnType<typeof homeMapper>;
  sidebar: (raw: RawSidebarContent) => ReturnType<typeof sidebarMapper>;
  authors: (raw: RawAuthors) => ReturnType<typeof authorsMapper>;
  authorProfile: (
    raw: RawAuthorProfile,
    nickname: string,
  ) => ReturnType<typeof authorProfileMapper>;
  search: (raw: RawSearchPosts) => ReturnType<typeof searchMapper>;
};

/** Bind asset URL resolution into mappers that need Directus asset URLs. */
export function createBlogMappers(resolveAssetUrl: AssetUrlResolver): BlogMappers {
  return {
    category: categoryMapper,
    categoryInPost: categoryInPostMapper,
    calculatePostCount,
    navigation: navigationMapper,
    tag: tagMapper,
    tagInPost: tagInPostMapper,
    seriesInPost: seriesInPostMapper,
    sitemap: sitemapMapper,
    rss: rssMapper,
    series: (raw) => seriesMapper(raw, resolveAssetUrl),
    post: (raw) => postMapper(raw, resolveAssetUrl),
    postDetail: (raw) => postDetailMapper(raw, resolveAssetUrl),
    postSearch: (raw) => postSearchMapper(raw, resolveAssetUrl),
    home: (raw) => homeMapper(raw, resolveAssetUrl),
    sidebar: (raw) => sidebarMapper(raw, resolveAssetUrl),
    authors: (raw) => authorsMapper(raw, resolveAssetUrl),
    authorProfile: (raw, nickname) => authorProfileMapper(raw, nickname, resolveAssetUrl),
    search: (raw) => searchMapper(raw, resolveAssetUrl),
  };
}
