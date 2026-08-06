import type { AssetUrlResolver } from '../asset-url.js';
import type { RawSeriesItem, RawSeriesItemInPost } from '../types/raw/series.js';
import type { SeriesItem, SeriesItemInPost } from '../types/dto/series.js';

export function seriesMapper(
  raw: RawSeriesItem[],
  resolveAssetUrl: AssetUrlResolver,
): SeriesItem[] {
  return raw.map<SeriesItem>((item) => ({
    name: item.name,
    slug: item.slug,
    description: item.description,
    thumbnail: item.thumbnail?.id ? resolveAssetUrl(item.thumbnail.id) : null,
    postCount: Number(item.posts_func.count),
  }));
}

export function seriesInPostMapper(raw: RawSeriesItemInPost[]): SeriesItemInPost[] {
  return raw.map<SeriesItemInPost>((item) => ({
    name: item.series_id.name,
    slug: item.series_id.slug,
    postCount: Number(item.series_id.posts_func.count),
    posts: item.series_id.posts.map((post) => ({
      postIdx: post.posts_id.post_idx,
      slug: post.posts_id.slug,
      title: post.posts_id.title,
    })),
  }));
}
