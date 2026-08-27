import type {
  RawAuthors,
  RawSitemapItems,
  SitemapPost,
  SitemapUrlEntry,
} from '@croffledev/directus-blog-core';

function toEntry(path: string): SitemapUrlEntry {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return { loc: normalized, _path: normalized };
}

function postToEntry(post: SitemapPost): SitemapUrlEntry {
  return toEntry(`/posts/${post.postIdx}-${post.slug}`);
}

export default defineEventHandler(async (): Promise<SitemapUrlEntry[]> => {
  const { client, mappers } = useBlogCore();
  const { sitemap, authors, buildQuery } = useQuery();

  try {
    const resp = await client.query<RawSitemapItems>(buildQuery(sitemap));
    const sitemapItems = mappers.sitemap(resp);

    const postUrls = sitemapItems.posts.map(postToEntry);
    const categoryUrls = sitemapItems.categories.map((item) => toEntry(`/categories/${item.slug}`));
    const tagUrls = sitemapItems.tags.map((item) => toEntry(`/tags/${item.slug}`));
    const seriesUrls = sitemapItems.series.map((item) => toEntry(`/series/${item.slug}`));

    // 저자 아카이브 — 글이 하나도 없는 필진은 thin page라 색인에서 제외
    let authorUrls: SitemapUrlEntry[] = [];
    try {
      const roster = mappers.authors(
        await queryWithOptionalBio<RawAuthors>((withBio) =>
          client.query<RawAuthors>(buildQuery(authors(withBio))),
        ),
      );
      authorUrls = roster
        .filter((author) => author.postCount > 0)
        .map((author) => toEntry(`/authors/${encodeURIComponent(author.slug)}`));
    } catch (error) {
      console.error('Failed to fetch author sitemap URLs:', error);
    }

    return [
      ...postUrls,
      ...categoryUrls,
      ...tagUrls,
      ...seriesUrls,
      ...authorUrls,
      toEntry('/posts'),
      toEntry('/series'),
      toEntry('/tags'),
      toEntry('/authors'),
    ];
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error);
    return [];
  }
});
