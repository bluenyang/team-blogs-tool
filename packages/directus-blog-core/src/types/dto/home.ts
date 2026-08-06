import type { PostItem } from './post.js';
import type { SeriesItem } from './series.js';

export interface HomePosts {
  recentPosts: PostItem[];
  popularSeries: SeriesItem[];
}
