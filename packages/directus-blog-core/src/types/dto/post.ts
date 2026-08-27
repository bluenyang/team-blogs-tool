import type { CategoryItemInPost } from './category.js';
import type { SeriesItemInPost } from './series.js';
import type { TagItemInPost } from './tag.js';

export interface PostAuthor {
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  nickname: string | null;
}

export interface PostItem {
  postIdx: number;
  author: PostAuthor;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  publishedAt: string;
  updatedAt: string;
  categories: string[] | null;
  tags: string[] | null;
  series: string[] | null;
}

export interface PostLink {
  postIdx: number;
  title: string;
  slug: string;
}

export interface PostDetail {
  postIdx: number;
  author: PostAuthor;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  content: string;
  publishedAt: string;
  updatedAt: string;
  categories: CategoryItemInPost[] | null;
  tags: TagItemInPost[] | null;
  series: SeriesItemInPost[] | null;
  /** 시리즈와 무관한 블로그 전체 기준 이전/다음 글 */
  prev: PostLink | null;
  next: PostLink | null;
}

export interface PostsResponse {
  searchType: 'search' | 'series' | 'category' | 'tag' | null;
  metadata?: PostSearch;
  totalCount: number;
  posts: PostItem[];
}

export interface PostSearch {
  name: string;
  slug: string;
  totalCount: number;
  description?: string;
  thumbnail?: string;
}
