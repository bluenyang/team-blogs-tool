<script setup lang="ts">
  const { sidebar } = useSidebar();
  const route = useRoute();

  const tags = computed(() => sidebar.value?.tags.items ?? []);

  function isActiveTag(slug: string) {
    return route.name === 'tags-slug' && decodeRouteSlug(String(route.params.slug || '')) === slug;
  }
</script>

<template>
  <div v-if="tags.length > 0" class="px-2 py-4">
    <div class="mb-3 px-2 text-sm font-bold">{{ '태그' }}</div>
    <ul class="flex flex-wrap gap-2 px-2">
      <li v-for="tag in tags" :key="tag.slug">
        <NuxtLink
          :to="{
            name: 'tags-slug',
            params: { slug: tag.slug },
          }"
          :class="
            cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              {
                'bg-sidebar-primary text-sidebar-primary-foreground': isActiveTag(tag.slug),
                'bg-sidebar-accent hover:bg-sidebar-accent-hover text-sidebar-foreground':
                  !isActiveTag(tag.slug),
              },
            )
          "
        >
          <span>{{ tag.name }}</span>
          <span
            :class="
              cn(
                'text-muted-foreground text-xs',
                isActiveTag(tag.slug) && 'text-sidebar-primary-foreground/80',
              )
            "
            >{{ tag.postCount }}</span
          >
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
