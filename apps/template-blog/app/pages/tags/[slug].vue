<script setup lang="ts">
  const route = useRoute();
  const slug = computed(() => decodeRouteSlug(String(route.params.slug || '')));
</script>

<template>
  <div>
    <FilteredPostsView :tag="slug" />
  </div>
</template>
