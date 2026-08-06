import type { RawPostItem } from './post.js';
import type { RawSeriesItem } from './series.js';

export interface RawHomePosts {
  homePosts: RawPostItem[];
  homeSeries: RawSeriesItem[];
}
