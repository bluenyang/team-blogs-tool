import type { PostAuthor, PostItem } from '@croffledev/directus-blog-core';

export function postPath(post: Pick<PostItem, 'postIdx' | 'slug'>): string {
  return `/posts/${post.postIdx}-${post.slug}`;
}

export function primaryCategory(post: Pick<PostItem, 'categories'>): string | null {
  return post.categories?.[0] ?? null;
}

export function primarySeries(post: Pick<PostItem, 'series'>): string | null {
  return post.series?.[0] ?? null;
}

/** 저자 아카이브 라우트 키. nickname이 비면 링크를 걸지 않는다. */
export function authorPath(author: Pick<PostAuthor, 'nickname'>): string | null {
  return author.nickname ? `/authors/${encodeURIComponent(author.nickname)}` : null;
}

export function authorDisplayName(author: PostAuthor): string {
  if (author.nickname) return author.nickname;
  const name = [author.lastName, author.firstName].filter(Boolean).join(' ').trim();
  return name || '익명';
}

export function authorRealName(author: PostAuthor): string | null {
  const name = [author.lastName, author.firstName].filter(Boolean).join(' ').trim();
  return name || null;
}

/**
 * 한국어 기준 읽는 시간(분).
 * 본문이 있는 글 상세에서만 쓴다 — 목록 쿼리는 성능상 content를 가져오지 않는다.
 */
export function readingMinutes(content: string | null | undefined): number {
  if (!content) return 0;
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~|-]/g, ' ');
  const korean = (plain.match(/[가-힣]/g) ?? []).length;
  const words = plain
    .replace(/[가-힣]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  // 한글 500자/분, 영문 220단어/분
  return Math.max(1, Math.round(korean / 500 + words / 220));
}

/** "카테고리 · 2026.08.21" 형태의 mono 메타 문자열 */
export function postMeta(post: PostItem): string {
  return [primaryCategory(post), formatPostDateYmd(post.publishedAt)].filter(Boolean).join(' · ');
}
