export interface RawTagItem {
  name: string;
  slug: string;
  posts_func: {
    count: number;
  };
}

export interface RawTagItemInPost {
  tags_id: {
    name: string;
    slug: string;
  };
}
