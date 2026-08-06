import type { RawCategoryTree } from '../types/raw/category.js';

/** Collect a category slug and all descendant slugs from a flat category tree. */
export function collectCategorySlugs(
  categories: RawCategoryTree['categories'],
  rootSlug: string,
): string[] {
  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    const parentSlug = category.parent_id?.slug;
    if (!parentSlug) {
      continue;
    }

    const children = childrenByParent.get(parentSlug) ?? [];
    children.push(category.slug);
    childrenByParent.set(parentSlug, children);
  }

  const slugs = new Set<string>();
  const pending = [rootSlug];

  while (pending.length > 0) {
    const slug = pending.pop()!;
    if (slugs.has(slug)) {
      continue;
    }

    slugs.add(slug);
    pending.push(...(childrenByParent.get(slug) ?? []));
  }

  return [...slugs];
}
