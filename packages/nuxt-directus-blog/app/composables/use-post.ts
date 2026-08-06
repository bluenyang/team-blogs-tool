import type { PostDetail } from '@croffledev/directus-blog-core';

export function usePostDetail(postIdx: number | string) {
  const { data, pending, error } = useFetch<PostDetail>(`/api/post/${postIdx}`, {
    method: 'GET',
    key: `post-${postIdx}`,
    getCachedData(key, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      }
    },
  });

  return {
    post: computed(() => data.value || undefined),
    pending,
    error,
  };
}
