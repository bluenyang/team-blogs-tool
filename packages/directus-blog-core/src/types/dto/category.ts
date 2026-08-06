export interface CategoryItem {
  parentId: string | null;
  name: string;
  slug: string;
  icon: string | null;
  postCount?: number;
  children?: CategoryItem[];
}

export interface CategoryItemInPost {
  name: string;
  slug: string;
}
