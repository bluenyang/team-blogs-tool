/**
 * Directus blog CMS core — query / mapper / types extracted from my-blog.
 */
export const PACKAGE_NAME = '@croffledev/directus-blog-core' as const;

export { createAssetUrlResolver, type AssetUrlResolver } from './asset-url.js';
export {
  createBlogClientOptions,
  createBlogCore,
  createDirectusClient,
  type BlogClientOptions,
  type BlogCore,
  type DirectusClient,
} from './client.js';
export * from './mappers/index.js';
export * from './queries/index.js';
export type * from './types/index.js';
export * from './utils/index.js';
