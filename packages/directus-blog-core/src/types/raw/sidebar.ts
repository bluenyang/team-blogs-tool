import type { RawCategoryItem } from './category.js';
import type { RawNavigationItem } from './navigation.js';
import type { RawSeriesItem } from './series.js';
import type { RawTagItem } from './tag.js';

export interface RawSidebarContent {
  sidebarPostCount: {
    count: {
      id: number;
    };
  }[];
  sidebarCategories: RawCategoryItem[];
  sidebarSeries: RawSeriesItem[];
  sidebarTags: RawTagItem[];
  sidebarNavigations: RawNavigationItem[];
  blogSettings?: {
    allow_ccl: boolean;
    allow_commercial?: boolean;
    change_content?: 'allow' | 'share_alike' | 'no_derivative';
    license_note?: string;
  }[];
}
