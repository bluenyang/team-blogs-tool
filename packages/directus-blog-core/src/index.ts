/**
 * Directus blog CMS core — query / mapper / types will live here.
 * Extracted from the reference Nuxt blog (my-blog).
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
