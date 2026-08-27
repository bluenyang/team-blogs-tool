import type { PostItem } from './post.js';

export interface AuthorLink {
  name: string;
  /** 링크 칩에 표시할 텍스트 */
  label: string;
  url: string;
  icon: string;
}

export interface AuthorItem {
  /** directus_users.id */
  id: string;
  /** 라우트 키. nickname이 없으면 id로 폴백한다. */
  slug: string;
  nickname: string;
  /** 실명 */
  name: string | null;
  role: string | null;
  bio: string | null;
  avatar: string | null;
  postCount: number;
  links: AuthorLink[];
}

export interface AuthorTopic {
  name: string;
  slug: string;
  count: number;
}

export interface AuthorProfile {
  author: AuthorItem;
  posts: PostItem[];
  totalCount: number;
  topics: AuthorTopic[];
  seriesCount: number;
  /** 사이드바 "다른 필진" */
  others: AuthorItem[];
}
