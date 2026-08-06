export interface RawCategoryItem {
  id: string;
  parent_id: {
    id: string;
  } | null;
  name: string;
  icon: string | null;
  slug: string;
  posts_func: {
    count: number;
  };
}

export interface RawCategoryItemInPost {
  categories_id: {
    name: string;
    slug: string;
  };
}

export interface RawCategoryTree {
  categories: {
    slug: string;
    parent_id: {
      slug: string;
    } | null;
  }[];
}
