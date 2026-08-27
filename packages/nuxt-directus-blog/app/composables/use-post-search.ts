import type { SearchResponse } from '@croffledev/directus-blog-core';

/**
 * ⌘K 팔레트용 즉시 검색.
 * 디바운스된 질의만 서버로 보내고, 2글자 미만이면 아예 요청하지 않는다.
 */
export function usePostSearch(query: MaybeRefOrGetter<string>, limit = 8) {
  const term = computed(() => toValue(query).trim());
  const enabled = computed(() => term.value.length >= 2);

  const { data, pending, error } = useFetch<SearchResponse>('/api/search', {
    method: 'GET',
    key: computed(() => `search|${term.value}|${limit}`),
    query: computed(() => ({ q: term.value, limit })),
    immediate: false,
    server: false,
    watch: [term],
    default: () => ({ query: '', posts: [] }),
  });

  return {
    hits: computed(() => (enabled.value ? (data.value?.posts ?? []) : [])),
    enabled,
    pending,
    error,
  };
}
