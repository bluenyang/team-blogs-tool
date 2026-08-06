export interface SitemapUrlEntry {
  loc: string;
  _path: string;
}

export interface RawSitemapPost {
  post_idx: number;
  slug: string;
}

export interface SitemapPost {
  postIdx: number;
  slug: string;
}

export interface SitemapSlugItem {
  slug: string;
}

export interface RawSitemapItems {
  posts: RawSitemapPost[];
  categories: SitemapSlugItem[];
  tags: SitemapSlugItem[];
  series: SitemapSlugItem[];
}

export interface SitemapItems {
  posts: SitemapPost[];
  categories: SitemapSlugItem[];
  tags: SitemapSlugItem[];
  series: SitemapSlugItem[];
}
