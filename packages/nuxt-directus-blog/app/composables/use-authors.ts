import type { AuthorItem } from '@croffledev/directus-blog-core';

/** 필진 로스터 — 홈 필진 섹션, /authors, 저자 페이지 사이드바가 공유한다. */
export function useAuthors() {
  const { data, pending, error } = useFetch<AuthorItem[]>('/api/authors', {
    method: 'GET',
    key: 'authors',
    getCachedData(key, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      }
    },
  });

  return {
    authors: computed(() => data.value ?? []),
    pending,
    error,
  };
}
