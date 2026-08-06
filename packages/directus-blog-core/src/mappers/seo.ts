import type { RawRssPosts, RssPost } from '../types/rss.js';
import type { RawSitemapItems, SitemapItems } from '../types/sitemap.js';

export function sitemapMapper(raw: RawSitemapItems): SitemapItems {
  return {
    posts: raw.posts.map((post) => ({
      postIdx: post.post_idx,
      slug: post.slug,
    })),
    categories: raw.categories,
    tags: raw.tags,
    series: raw.series,
  };
}

export function rssMapper(raw: RawRssPosts): RssPost[] {
  return raw.posts.map((post) => ({
    author: post.author_id.nickname ?? `${post.author_id.first_name} ${post.author_id.last_name}`,
    id: post.id,
    postIdx: post.post_idx,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    publishedAt: new Date(post.published_at),
  }));
}
