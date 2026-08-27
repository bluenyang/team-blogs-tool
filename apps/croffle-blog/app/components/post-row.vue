<script setup lang="ts">
  import type { PostItem } from '@croffledev/directus-blog-core';

  const { post, showSeries = true } = defineProps<{
    post: PostItem;
    showSeries?: boolean;
  }>();

  const category = computed(() => primaryCategory(post));
  const series = computed(() => (showSeries ? primarySeries(post) : null));
  const tags = computed(() => post.tags?.slice(0, 3) ?? []);
</script>

<template>
  <NuxtLink
    :to="postPath(post)"
    class="glass glass-interactive grid gap-5 rounded-xl p-5 sm:grid-cols-[1fr_168px]"
  >
    <div class="flex min-w-0 flex-col gap-2.25">
      <div class="flex flex-wrap items-center gap-2.25 font-mono text-[10.5px] font-medium">
        <span v-if="category" class="text-primary tracking-wider">{{ category }}</span>
        <time :datetime="formatPostDateIso(post.publishedAt)" class="text-fg-35">
          {{ formatPostDateYmd(post.publishedAt) }}
        </time>
        <span v-if="series" class="text-fg-35 flex items-center gap-1">
          <Icon name="lucide:layers" class="size-3" />
          {{ series }}
        </span>
      </div>

      <h3 class="font-display text-row-title font-bold tracking-tight text-pretty">
        {{ post.title }}
      </h3>

      <p v-if="post.summary" class="text-fg-50 line-clamp-2 text-[13px] leading-[1.7] text-pretty">
        {{ post.summary }}
      </p>

      <div class="mt-1 flex flex-wrap items-center gap-1.5">
        <span
          v-for="tag in tags"
          :key="tag"
          class="bg-glass-2 text-fg-50 rounded-md px-2 py-1 font-mono text-[10.5px] font-medium"
        >
          #{{ tag }}
        </span>
        <span class="text-fg-35 ml-auto flex items-center gap-1.5 font-mono text-[10.5px]">
          <AuthorAvatar
            :src="post.author.avatar"
            :name="authorDisplayName(post.author)"
            :size="18"
          />
          {{ authorDisplayName(post.author) }}
        </span>
      </div>
    </div>

    <div class="bg-glass-2 hidden overflow-hidden rounded-xl sm:block">
      <NuxtImg
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        width="336"
        height="240"
        sizes="168px"
        loading="lazy"
        class="size-full object-cover"
      />
      <span v-else class="text-fg-35 grid size-full place-items-center">
        <Icon name="lucide:image" class="size-5" />
      </span>
    </div>
  </NuxtLink>
</template>
