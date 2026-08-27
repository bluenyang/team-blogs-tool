<script setup lang="ts">
  import type { PostItem } from '@croffledev/directus-blog-core';

  const { post } = defineProps<{ post: PostItem }>();

  const category = computed(() => primaryCategory(post));
  const series = computed(() => primarySeries(post));
  const { realName: lookupRealName } = useAuthorLookup();
  const authorName = computed(() => authorDisplayName(post.author));
  const realName = computed(() => lookupRealName(post.author));
</script>

<template>
  <NuxtLink
    :to="postPath(post)"
    class="glass-strong glass-interactive group grid overflow-hidden rounded-[20px] lg:grid-cols-[1.08fr_0.92fr]"
  >
    <div class="flex flex-col gap-3.75 px-6 py-7 sm:px-8 sm:py-7.5">
      <div class="flex flex-wrap items-center gap-2.25">
        <span
          class="bg-primary text-primary-foreground rounded-md px-2.25 py-1 font-mono text-[10.5px] font-medium tracking-[0.06em]"
        >
          FEATURED
        </span>
        <span v-if="category || series" class="text-fg-40 font-mono text-[11.5px] font-medium">
          {{ [category, series].filter(Boolean).join(' · ') }}
        </span>
      </div>

      <h2
        class="font-display sm:text-feature text-[24px] leading-[1.28] font-bold tracking-[-0.03em] text-pretty"
      >
        {{ post.title }}
      </h2>

      <p v-if="post.summary" class="text-fg-50 line-clamp-3 text-[14px] leading-[1.75] text-pretty">
        {{ post.summary }}
      </p>

      <div class="mt-auto flex items-center gap-2.75 pt-4">
        <AuthorAvatar :src="post.author.avatar" :name="authorName" :size="34" />
        <div class="flex min-w-0 flex-col gap-0.5">
          <span class="truncate text-[13px] font-semibold">
            {{ authorName }}
            <span v-if="realName" class="text-fg-40 font-normal">{{ realName }}</span>
          </span>
          <time
            :datetime="formatPostDateIso(post.publishedAt)"
            class="text-fg-40 font-mono text-[11px] font-medium"
          >
            {{ formatPostDateYmd(post.publishedAt) }}
          </time>
        </div>
      </div>
    </div>

    <div
      class="bg-glass-2 border-border order-first min-h-45 border-b lg:order-0 lg:min-h-72.5 lg:border-b-0 lg:border-l"
    >
      <NuxtImg
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        width="720"
        height="580"
        sizes="sm:100vw lg:600px"
        loading="eager"
        fetchpriority="high"
        preload
        class="size-full object-cover"
      />
      <span v-else class="text-fg-35 grid size-full place-items-center">
        <Icon name="lucide:image" class="size-8" />
      </span>
    </div>
  </NuxtLink>
</template>
