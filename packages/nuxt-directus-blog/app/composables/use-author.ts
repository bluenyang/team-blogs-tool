import type { AuthorProfile } from '@croffledev/directus-blog-core';

/**
 * 저자 한 명의 프로필 + 글 아카이브.
 * 서버가 프로필·글·주제 분포·다른 필진을 한 번에 내려주므로 화면에서 추가 요청이 없다.
 *
 * async인 것이 중요하다 — 호출부가 await해야 SSR setup에서 404를 즉시 판별할 수 있다.
 */
export async function useAuthorProfile(
  nick: MaybeRefOrGetter<string>,
  limit: MaybeRefOrGetter<number> = 10,
  page: MaybeRefOrGetter<number> = 1,
) {
  const nickname = computed(() => toValue(nick));
  const query = computed(() => ({ limit: toValue(limit), page: toValue(page) }));
  const key = computed(() => `author|${nickname.value}|l${query.value.limit}|p${query.value.page}`);

  const { data, pending, error } = await useFetch<AuthorProfile>(
    () => `/api/author/${encodeURIComponent(nickname.value)}`,
    {
      method: 'GET',
      key,
      query,
      getCachedData(cacheKey, nuxtApp) {
        if (nuxtApp.isHydrating) {
          return nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey];
        }
      },
    },
  );

  return {
    profile: computed(() => data.value ?? undefined),
    author: computed(() => data.value?.author),
    posts: computed(() => data.value?.posts ?? []),
    totalCount: computed(() => data.value?.totalCount ?? 0),
    topics: computed(() => data.value?.topics ?? []),
    seriesCount: computed(() => data.value?.seriesCount ?? 0),
    others: computed(() => data.value?.others ?? []),
    pending,
    error,
  };
}
