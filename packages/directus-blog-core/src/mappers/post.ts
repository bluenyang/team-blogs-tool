import type { AssetUrlResolver } from '../asset-url.js';
import type { ImageQuery } from '../types/image.js';
import type {
  RawCategoryItem,
  RawPostDetail,
  RawPostItem,
  RawPostLink,
  RawSeriesItem,
  RawTagItem,
} from '../types/raw/index.js';
import type { PostDetail, PostItem, PostLink, PostSearch } from '../types/dto/post.js';

import { categoryInPostMapper } from './category.js';
import { seriesInPostMapper } from './series.js';
import { tagInPostMapper } from './tag.js';

/** size-12(48px) @2x — Directus avatar transform */
const avatarImageQuery: ImageQuery = {
  width: 96,
  height: 96,
  format: 'webp',
  quality: 80,
  fit: 'cover',
};

export function postMapper(raw: RawPostItem[], resolveAssetUrl: AssetUrlResolver): PostItem[] {
  return raw.map<PostItem>((item) => ({
    postIdx: item.post_idx,
    author: {
      firstName: item.author_id.first_name,
      lastName: item.author_id.last_name,
      avatar: item.author_id.avatar?.id
        ? resolveAssetUrl(item.author_id.avatar.id, avatarImageQuery)
        : null,
      nickname: item.author_id.nickname,
    },
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    thumbnail: item.thumbnail?.id ? resolveAssetUrl(item.thumbnail.id) : null,
    publishedAt: item.published_at,
    updatedAt: item.updated_at,
    categories: item.categories.map((category) => category.categories_id.name),
    tags: item.tags.map((tag) => tag.tags_id.name),
    series: item.series.map((series) => series.series_id.name),
  }));
}

function postLinkMapper(raw: RawPostLink[] | null | undefined): PostLink | null {
  const link = raw?.[0];
  if (!link) return null;
  return { postIdx: link.post_idx, title: link.title, slug: link.slug };
}

export function postDetailMapper(
  raw: RawPostDetail,
  resolveAssetUrl: AssetUrlResolver,
): PostDetail {
  if (raw.posts.length === 0) {
    throw new Error('No posts found');
  }

  const post = raw.posts[0]!;

  return {
    postIdx: post.post_idx,
    author: {
      firstName: post.author_id.first_name,
      lastName: post.author_id.last_name,
      avatar: post.author_id.avatar?.id
        ? resolveAssetUrl(post.author_id.avatar.id, avatarImageQuery)
        : null,
      nickname: post.author_id.nickname,
    },
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    thumbnail: post.thumbnail?.id ? resolveAssetUrl(post.thumbnail.id) : null,
    content: post.content,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    categories: post.categories ? categoryInPostMapper(post.categories) : null,
    tags: post.tags ? tagInPostMapper(post.tags) : null,
    series: post.series ? seriesInPostMapper(post.series) : null,
    prev: postLinkMapper(raw.prevPost),
    next: postLinkMapper(raw.nextPost),
  };
}

export function postSearchMapper(
  raw: RawCategoryItem | RawSeriesItem | RawTagItem,
  resolveAssetUrl: AssetUrlResolver,
): PostSearch {
  if ('description' in raw) {
    return {
      name: raw.name,
      slug: raw.slug,
      totalCount: raw.posts_func.count,
      description: raw.description ? raw.description : undefined,
      thumbnail: raw.thumbnail ? resolveAssetUrl(raw.thumbnail.id) : undefined,
    };
  }
  return {
    name: raw.name,
    slug: raw.slug,
    totalCount: raw.posts_func.count,
  };
}
