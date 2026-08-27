<script setup lang="ts">
  import type { PostItem } from '@croffledev/directus-blog-core';

  const { post, priority = false } = defineProps<{
    post: PostItem;
    /** 첫 화면에 보이는 카드만 eager 로딩 */
    priority?: boolean;
  }>();

  const category = computed(() => primaryCategory(post));
  const authorName = computed(() => authorDisplayName(post.author));
</script>

<template>
  <NuxtLink
    :to="postPath(post)"
    class="glass glass-interactive group flex flex-col overflow-hidden rounded-2xl"
  >
    <div class="bg-glass-2 relative h-28 shrink-0 overflow-hidden">
      <NuxtImg
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        width="420"
        height="224"
        sizes="sm:100vw md:50vw lg:400px"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        class="size-full object-cover"
      />
      <span v-else class="text-fg-35 grid size-full place-items-center">
        <Icon name="lucide:image" class="size-6" />
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-2.25 px-4.5 pt-4.25 pb-4.5">
      <span v-if="category" class="text-primary font-mono text-[10.5px] font-medium tracking-wider">
        {{ category }}
      </span>
      <h3
        class="font-display text-card-title line-clamp-2 font-bold tracking-[-0.02em] text-pretty"
      >
        {{ post.title }}
      </h3>
      <p v-if="post.summary" class="text-fg-50 text-label line-clamp-3">{{ post.summary }}</p>

      <div class="mt-auto flex items-center gap-2 pt-3">
        <AuthorAvatar :src="post.author.avatar" :name="authorName" :size="22" />
        <span class="text-fg-40 truncate font-mono text-[11px] font-medium">
          {{ authorName }} · {{ formatPostDateYmd(post.publishedAt) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
