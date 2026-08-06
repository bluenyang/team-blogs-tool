import { createDirectus, graphql, rest } from '@directus/sdk';

import { createAssetUrlResolver, type AssetUrlResolver } from './asset-url.js';
import { createBlogMappers, type BlogMappers } from './mappers/create-mappers.js';

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

export function createDirectusClient(url: string) {
  return createDirectus(url).with(rest()).with(graphql());
}

export type DirectusClient = ReturnType<typeof createDirectusClient>;

export type BlogCore = {
  blogSlug: string;
  client: DirectusClient;
  resolveAssetUrl: AssetUrlResolver;
  mappers: BlogMappers;
};

/** Create a Nuxt-free Directus client + asset URL resolver + mappers. */
export function createBlogCore(options: BlogClientOptions): BlogCore {
  const { directusUrl, blogSlug } = createBlogClientOptions(options);
  const resolveAssetUrl = createAssetUrlResolver(directusUrl);

  return {
    blogSlug,
    client: createDirectusClient(directusUrl),
    resolveAssetUrl,
    mappers: createBlogMappers(resolveAssetUrl),
  };
}
