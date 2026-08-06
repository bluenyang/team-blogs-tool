import type { HomePosts } from '@croffledev/directus-blog-core';

export function useHome() {
  const { data, pending, error } = useFetch<HomePosts>('/api/home', {
    method: 'GET',
    key: 'home',
    getCachedData(key, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      }
    },
  });

  return {
    recentPosts: computed(() => data.value?.recentPosts || []),
    popularSeries: computed(() => data.value?.popularSeries || []),
    pending,
    error,
  };
}
