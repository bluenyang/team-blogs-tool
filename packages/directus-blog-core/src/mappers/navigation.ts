import type { RawNavigationItem } from '../types/raw/navigation.js';
import type { NavigationItem } from '../types/dto/navigation.js';
import { buildTree } from '../utils/build-tree.js';

export function navigationMapper(raw: RawNavigationItem[]): NavigationItem[] {
  const items: NavigationItem[] = raw.map<NavigationItem>((item) => ({
    id: item.id,
    label: item.label,
    url: item.url,
    icon: item.icon,
    isCategory: item.is_category,
    parentId: item.parent_id?.id || null,
  }));
  return buildTree<NavigationItem>(items);
}
