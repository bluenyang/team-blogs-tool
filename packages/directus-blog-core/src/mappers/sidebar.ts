import type { AssetUrlResolver } from '../asset-url.js';
import type { RawSidebarContent } from '../types/raw/sidebar.js';
import type { SidebarContent } from '../types/dto/sidebar.js';

import { categoryMapper } from './category.js';
import { navigationMapper } from './navigation.js';
import { seriesMapper } from './series.js';
import { tagMapper } from './tag.js';

export function sidebarMapper(
  raw: RawSidebarContent,
  resolveAssetUrl: AssetUrlResolver,
): SidebarContent {
  const [sidebarPostCount] = raw.sidebarPostCount;
  const blogSettings = raw.blogSettings?.[0];

  return {
    profile: {
      totalPosts: Number(sidebarPostCount!.count.id),
    },
    categories: {
      items: categoryMapper(raw.sidebarCategories),
    },
    series: {
      items: seriesMapper(raw.sidebarSeries, resolveAssetUrl),
    },
    tags: {
      items: tagMapper(raw.sidebarTags),
    },
    navigations: {
      items: navigationMapper(raw.sidebarNavigations),
    },
    blogSettings: blogSettings
      ? {
          allowCCL: blogSettings.allow_ccl,
          allowCommercial: blogSettings.allow_commercial,
          changeContent: blogSettings.change_content,
          licenseNote: blogSettings.license_note,
        }
      : undefined,
  };
}
