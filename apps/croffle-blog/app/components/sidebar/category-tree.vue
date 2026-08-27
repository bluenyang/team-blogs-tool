<script setup lang="ts">
  import type { CategoryItem } from '@croffledev/directus-blog-core';

  const { items, depth = 0 } = defineProps<{
    items: CategoryItem[];
    depth?: number;
  }>();

  const route = useRoute();

  function isActive(item: CategoryItem) {
    return (
      route.name === 'categories-slug' &&
      decodeRouteSlug(String(route.params.slug || '')) === item.slug
    );
  }
</script>

<template>
  <ul class="flex flex-col gap-0.5">
    <li v-for="item in items" :key="item.slug">
      <NuxtLink
        :to="{ name: 'categories-slug', params: { slug: item.slug } }"
        :aria-current="isActive(item) ? 'page' : undefined"
        :class="
          cn(
            'flex items-center justify-between gap-2 rounded-lg py-1.5 pr-2 text-[13px] transition-colors',
            isActive(item) ? 'text-primary font-semibold' : 'text-fg-80 hover:text-foreground',
          )
        "
        :style="{ paddingLeft: `${depth * 14 + 8}px` }"
      >
        <span class="min-w-0 truncate">{{ item.name }}</span>
        <span class="text-fg-35 shrink-0 font-mono text-[11px] font-medium">
          {{ item.postCount ?? 0 }}
        </span>
      </NuxtLink>

      <SidebarCategoryTree v-if="item.children?.length" :items="item.children" :depth="depth + 1" />
    </li>
  </ul>
</template>
