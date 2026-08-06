import { createBlogCore, type BlogCore, type ImageQuery } from '@croffledev/directus-blog-core';

function requirePublicConfig() {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl as string | undefined;
  const blogSlug = config.public.blogSlug as string | undefined;

  if (!directusUrl) {
    throw new Error('[nuxt-directus-blog] runtimeConfig.public.directusUrl is not set');
  }
  if (!blogSlug) {
    throw new Error('[nuxt-directus-blog] runtimeConfig.public.blogSlug is not set');
  }

  return { directusUrl, blogSlug, config };
}

/** Nitro / server route용 blog core (client + mappers + asset resolver) */
export function useBlogCore(): BlogCore {
  const { directusUrl, blogSlug } = requirePublicConfig();
  return createBlogCore({ directusUrl, blogSlug });
}

/** Nitro / server route용 Directus 클라이언트 */
export function useDirectus() {
  return useBlogCore().client;
}

export function getDirectusImageUrl(id: string, query?: ImageQuery) {
  return useBlogCore().resolveAssetUrl(id, query);
}
