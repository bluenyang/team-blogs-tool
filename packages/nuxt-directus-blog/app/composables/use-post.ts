import type { PostDetail } from '@croffledev/directus-blog-core';

/**
 * 글 상세.
 *
 * async인 것이 중요하다 — 호출부가 await해야 SSR setup 안에서 `post.value`를 바로 읽을 수 있다.
 * await하지 않으면 Nuxt가 렌더 직전에야 asyncData를 해소하므로, setup에서 본문을 파싱하거나
 * 상태 코드를 검사하는 코드가 빈 값을 보게 된다.
 */
export async function usePostDetail(postIdx: MaybeRefOrGetter<number | string>) {
  const idx = computed(() => toValue(postIdx));

  const { data, pending, error } = await useFetch<PostDetail>(() => `/api/post/${idx.value}`, {
    method: 'GET',
    key: computed(() => `post-${idx.value}`),
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
