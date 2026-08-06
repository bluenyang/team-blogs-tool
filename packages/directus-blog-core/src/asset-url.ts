import type { ImageQuery } from './types/image.js';

export type AssetUrlResolver = (id: string, query?: ImageQuery) => string;

export function createAssetUrlResolver(directusUrl: string): AssetUrlResolver {
  const base = directusUrl.replace(/\/$/, '');

  return (id, query) => {
    if (!query) {
      return `${base}/assets/${id}`;
    }

    const params = Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return params ? `${base}/assets/${id}?${params}` : `${base}/assets/${id}`;
  };
}
