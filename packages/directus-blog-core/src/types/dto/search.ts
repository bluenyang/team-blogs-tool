export interface SearchPostHit {
  postIdx: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  publishedAt: string;
  category: string | null;
  authorNickname: string | null;
}

export interface SearchResponse {
  query: string;
  posts: SearchPostHit[];
}
