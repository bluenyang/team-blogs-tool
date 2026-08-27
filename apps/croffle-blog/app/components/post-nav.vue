<script setup lang="ts">
  import type { PostLink } from '@croffledev/directus-blog-core';

  defineProps<{
    prev?: PostLink | null;
    next?: PostLink | null;
  }>();
</script>

<template>
  <nav v-if="prev || next" class="grid gap-3.5 pt-1 sm:grid-cols-2" aria-label="이전/다음 글">
    <NuxtLink
      v-if="prev"
      :to="postPath(prev)"
      class="glass glass-interactive flex flex-col gap-1.75 rounded-lg p-4.25"
    >
      <span class="text-fg-40 font-mono text-[10.5px] font-medium">← 이전 글</span>
      <span class="line-clamp-2 text-[13.5px] leading-[1.45] font-semibold">{{ prev.title }}</span>
    </NuxtLink>
    <span v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="postPath(next)"
      class="glass glass-interactive flex flex-col gap-1.75 rounded-lg p-4.25 sm:text-right"
    >
      <span class="text-fg-40 font-mono text-[10.5px] font-medium">다음 글 →</span>
      <span class="line-clamp-2 text-[13.5px] leading-[1.45] font-semibold">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>
