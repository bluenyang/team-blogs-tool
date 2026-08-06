/**
 * Directus blog CMS core — query / mapper / types extracted from my-blog.
 */
export const PACKAGE_NAME = '@croffledev/directus-blog-core' as const;

export type BlogClientOptions = {
  directusUrl: string;
  blogSlug: string;
};

export function createBlogClientOptions(options: BlogClientOptions): BlogClientOptions {
  if (!options.directusUrl) {
    throw new Error('[directus-blog-core] directusUrl is required');
  }
  if (!options.blogSlug) {
    throw new Error('[directus-blog-core] blogSlug is required');
  }
  return options;
}

export type * from './types/index.js';
export * from './queries/index.js';
export * from './utils/index.js';
