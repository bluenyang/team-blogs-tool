export interface SeriesItem {
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  postCount?: number;
}

export interface SeriesItemInPost {
  name: string;
  slug: string;
  postCount?: number;
  posts: {
    postIdx: number;
    slug: string;
    title: string;
  }[];
}
