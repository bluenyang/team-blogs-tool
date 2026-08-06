import type { PostsResponse } from '@croffledev/directus-blog-core';

export function usePostList(
  limit: MaybeRefOrGetter<number>,
  page: MaybeRefOrGetter<number>,
  search?: MaybeRefOrGetter<string | undefined>,
  category?: MaybeRefOrGetter<string | undefined>,
  tag?: MaybeRefOrGetter<string | undefined>,
  series?: MaybeRefOrGetter<string | undefined>,
) {
  const query = computed(() => ({
    limit: toValue(limit),
    page: toValue(page),
    search: toValue(search) || undefined,
    category: toValue(category) || undefined,
    tag: toValue(tag) || undefined,
    series: toValue(series) || undefined,
  }));

  // query 직렬화 차이로 auto-key가 SSR/클라이언트에서 어긋나지 않도록 고정 키 사용
  const key = computed(() => {
    const q = query.value;
    return [
      'posts',
      `l${q.limit}`,
      `p${q.page}`,
      q.search ? `s:${q.search}` : '',
      q.category ? `c:${q.category}` : '',
      q.tag ? `t:${q.tag}` : '',
      q.series ? `se:${q.series}` : '',
    ]
      .filter(Boolean)
      .join('|');
  });

  const { data, pending, error } = useFetch<PostsResponse>('/api/posts', {
    method: 'GET',
    key,
    query,
    getCachedData(cacheKey, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey];
      }
    },
  });

  return {
    posts: computed(() => data.value?.posts || []),
    metadata: computed(() => data.value?.metadata || undefined),
    totalCount: computed(() => data.value?.totalCount ?? 0),
    searchType: computed(() => data.value?.searchType || null),
    pending,
    error,
  };
}
