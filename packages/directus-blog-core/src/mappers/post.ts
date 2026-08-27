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

/**
 * 목록 카드용 썸네일. 카드(420w)·리스트(336w)·피처드(720w)가 같은 필드를 공유하므로
 * 가장 큰 쓰임에 여유를 둔 한 크기로 통일한다 — 작은 카드에는 살짝 과하지만, 원본을
 * 그대로 내려보내는 것보다는 항상 낫다.
 *
 * width만 지정해 종횡비를 보존한다: 각 카드는 CSS object-cover로 자기 비율에 맞게
 * 잘라 쓰므로, Directus 쪽에서 특정 비율로 크롭할 필요가 없다.
 */
const postThumbnailQuery: ImageQuery = {
  width: 960,
  format: 'webp',
  quality: 75,
};

/** 글 상세 커버(최대 렌더 폭 1280) + OG 이미지로 재사용 */
const postCoverQuery: ImageQuery = {
  width: 1280,
  format: 'webp',
  quality: 80,
};

/** 시리즈/카테고리/태그 검색 메타데이터 배너(2b·필터 뷰 상단, 최대 렌더 폭 1200) */
const searchMetaThumbnailQuery: ImageQuery = {
  width: 1200,
  format: 'webp',
  quality: 75,
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
    thumbnail: item.thumbnail?.id ? resolveAssetUrl(item.thumbnail.id, postThumbnailQuery) : null,
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
    thumbnail: post.thumbnail?.id ? resolveAssetUrl(post.thumbnail.id, postCoverQuery) : null,
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
      thumbnail: raw.thumbnail
        ? resolveAssetUrl(raw.thumbnail.id, searchMetaThumbnailQuery)
        : undefined,
    };
  }
  return {
    name: raw.name,
    slug: raw.slug,
    totalCount: raw.posts_func.count,
  };
}
