import type { RawCategoryItem, RawCategoryItemInPost } from './category.js';
import type { RawSeriesItem, RawSeriesItemInPost } from './series.js';
import type { RawTagItem, RawTagItemInPost } from './tag.js';

export interface RawPostAuthor {
  /** directus_users.id — blog_members에 없는 저자의 프로필을 만들 때 쓴다 */
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar: {
    id: string;
  } | null;
  nickname: string | null;
}

export interface RawPostItem {
  author_id: RawPostAuthor;
  post_idx: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: {
    id: string;
  };
  published_at: string;
  updated_at: string;
  categories: {
    categories_id: {
      name: string;
      slug: string;
    };
  }[];
  tags: {
    tags_id: {
      name: string;
      slug: string;
    };
  }[];
  series: {
    series_id: {
      name: string;
      slug: string;
    };
  }[];
}

export interface RawPostLink {
  post_idx: number;
  title: string;
  slug: string;
}

export interface RawPostDetail {
  prevPost?: RawPostLink[] | null;
  nextPost?: RawPostLink[] | null;
  posts: {
    author_id: RawPostAuthor;
    post_idx: number;
    title: string;
    slug: string;
    summary: string | null;
    thumbnail: {
      id: string;
    } | null;
    content: string;
    published_at: string;
    updated_at: string;
    categories: RawCategoryItemInPost[] | null;
    tags: RawTagItemInPost[] | null;
    series: RawSeriesItemInPost[] | null;
  }[];
}

export interface RawPosts {
  posts: RawPostItem[];
  postsCount: {
    count: {
      id: number;
    };
  }[];
  series?: RawSeriesItem[];
  categories?: RawCategoryItem[];
  tags?: RawTagItem[];
}
