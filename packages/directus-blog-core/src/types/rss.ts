export interface RawRssPosts {
  posts: {
    author_id: {
      first_name: string;
      last_name: string;
      nickname: string;
    };
    id: string;
    post_idx: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    published_at: string;
  }[];
}

export interface RssPost {
  id: string;
  author: string;
  postIdx: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  publishedAt: Date;
}
