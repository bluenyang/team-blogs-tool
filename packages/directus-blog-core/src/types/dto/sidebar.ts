import type { CategoryItem } from './category.js';
import type { NavigationItem } from './navigation.js';
import type { SeriesItem } from './series.js';
import type { BlogSetting } from './setting.js';
import type { TagItem } from './tag.js';

export interface SidebarContent {
  profile: {
    totalPosts: number;
  };
  categories: {
    items: CategoryItem[];
  };
  series: {
    items: SeriesItem[];
  };
  tags: {
    items: TagItem[];
  };
  navigations: {
    items: NavigationItem[];
  };
  blogSettings?: BlogSetting;
}
