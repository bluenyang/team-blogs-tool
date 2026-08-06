import type { RawCategoryItem, RawCategoryItemInPost } from '../types/raw/category.js';
import type { CategoryItem, CategoryItemInPost } from '../types/dto/category.js';
import { buildTree } from '../utils/build-tree.js';

type CategoryItemWithId = Omit<CategoryItem, 'children'> & {
  id: string;
  children?: CategoryItemWithId[];
};

export function categoryMapper(raw: RawCategoryItem[]): CategoryItem[] {
  const items: CategoryItemWithId[] = raw.map<CategoryItemWithId>((item) => ({
    id: item.id,
    parentId: item.parent_id?.id || null,
    name: item.name,
    slug: item.slug,
    icon: item.icon,
    children: [],
    postCount: Number(item.posts_func.count),
  }));
  const builtTree = buildTree<CategoryItemWithId>(items);
  return builtTree.map((item) => calculatePostCount(item));
}

export function categoryInPostMapper(raw: RawCategoryItemInPost[]): CategoryItemInPost[] {
  return raw.map((item) => ({
    name: item.categories_id.name,
    slug: item.categories_id.slug,
  }));
}

export function calculatePostCount(item: CategoryItemWithId): CategoryItem {
  const payload: CategoryItem = {
    parentId: item.parentId,
    name: item.name,
    slug: item.slug,
    icon: item.icon,
    postCount: item.postCount,
  };

  if (item.children && item.children.length > 0) {
    payload.children = item.children.map<CategoryItem>((child) => calculatePostCount(child));
    payload.postCount = payload.children.reduce((acc, child) => acc + (child.postCount ?? 0), 0);
  }

  return payload;
}
