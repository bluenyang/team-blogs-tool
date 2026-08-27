import type { AssetUrlResolver } from '../asset-url.js';
import type { ImageQuery } from '../types/image.js';
import type { RawSearchPosts } from '../types/raw/search.js';
import type { SearchPostHit } from '../types/dto/search.js';

/** 팔레트 행 썸네일 34px @2x */
const hitThumbnailQuery: ImageQuery = {
  width: 68,
  height: 68,
  format: 'webp',
  quality: 70,
  fit: 'cover',
};

export function searchMapper(
  raw: RawSearchPosts,
  resolveAssetUrl: AssetUrlResolver,
): SearchPostHit[] {
  return (raw.searchPosts ?? []).map((post) => ({
    postIdx: post.post_idx,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    thumbnail: post.thumbnail?.id ? resolveAssetUrl(post.thumbnail.id, hitThumbnailQuery) : null,
    publishedAt: post.published_at,
    category: post.categories?.[0]?.categories_id?.name ?? null,
    authorNickname: post.author_id?.nickname ?? null,
  }));
}
