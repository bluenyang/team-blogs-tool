<script setup lang="ts">
  const route = useRoute();

  // 예전 /search?category|tag|series= 링크 호환
  watch(
    () => route.query,
    (query) => {
      if (typeof query.category === 'string' && query.category) {
        navigateTo(
          { name: 'categories-slug', params: { slug: decodeRouteSlug(query.category) } },
          { replace: true },
        );
        return;
      }
      if (typeof query.tag === 'string' && query.tag) {
        navigateTo(
          { name: 'tags-slug', params: { slug: decodeRouteSlug(query.tag) } },
          { replace: true },
        );
        return;
      }
      if (typeof query.series === 'string' && query.series) {
        navigateTo(
          { name: 'series-slug', params: { slug: decodeRouteSlug(query.series) } },
          { replace: true },
        );
      }
    },
    { immediate: true },
  );

  const searchValue = computed(() => String(route.query.search || ''));
</script>

<template>
  <div>
    <FilteredPostsView :search="searchValue" />
  </div>
</template>
