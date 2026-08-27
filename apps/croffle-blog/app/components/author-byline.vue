<script setup lang="ts">
  import type { PostAuthor } from '@croffledev/directus-blog-core';

  const { author } = defineProps<{ author: PostAuthor }>();

  // 로스터에서 실명·역할·글 수를 붙인다 — 이미 캐시된 payload라 추가 요청 없음
  const { lookup, realName: lookupRealName } = useAuthorLookup();

  const name = computed(() => authorDisplayName(author));
  const realName = computed(() => lookupRealName(author));
  const to = computed(() => authorPath(author));
  const roster = computed(() => lookup(author));
  const role = computed(() => roleLabel(roster.value?.role));
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to || undefined"
    :class="cn('glass flex items-center gap-3 rounded-2xl px-4 py-3.5', to && 'glass-interactive')"
  >
    <AuthorAvatar :src="author.avatar" :name="name" :size="38" />
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <span class="font-display truncate text-[13.5px] font-bold">
        {{ name }}
        <span v-if="realName" class="text-fg-40 font-normal">{{ realName }}</span>
      </span>
      <span v-if="role" class="text-fg-40 truncate text-[11.5px]">{{ role }}</span>
    </div>
    <span
      v-if="to && roster"
      class="border-border-strong bg-glass-3 text-fg-60 shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11.5px] font-semibold"
    >
      글 {{ roster.postCount }}편 →
    </span>
  </component>
</template>
