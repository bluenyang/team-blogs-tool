<script setup lang="ts">
  import type { AuthorItem } from '@croffledev/directus-blog-core';

  const { author } = defineProps<{ author: AuthorItem }>();

  const subtitle = computed(() =>
    [author.name, roleLabel(author.role)].filter(Boolean).join(' · '),
  );
</script>

<template>
  <NuxtLink
    :to="`/authors/${encodeURIComponent(author.slug)}`"
    class="glass glass-interactive flex flex-col items-center gap-2.25 rounded-2xl px-4 py-5 text-center"
  >
    <AuthorAvatar :src="author.avatar" :name="author.nickname" :size="56" />
    <span class="font-display text-[14px] font-bold">{{ author.nickname }}</span>
    <span v-if="subtitle" class="text-fg-40 line-clamp-1 text-[11.5px]">{{ subtitle }}</span>
    <span class="text-primary font-mono text-[11px] font-medium">{{ author.postCount }} posts</span>
  </NuxtLink>
</template>
