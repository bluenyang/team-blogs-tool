import type { AssetUrlResolver } from '../asset-url.js';
import type { RawHomePosts } from '../types/raw/home.js';
import type { HomePosts } from '../types/dto/home.js';

import { postMapper } from './post.js';
import { seriesMapper } from './series.js';

export function homeMapper(raw: RawHomePosts, resolveAssetUrl: AssetUrlResolver): HomePosts {
  return {
    recentPosts: postMapper(raw.homePosts, resolveAssetUrl),
    popularSeries: seriesMapper(raw.homeSeries, resolveAssetUrl),
  };
}
