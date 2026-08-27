<script setup lang="ts">
  import type { SeriesItemInPost } from '@croffledev/directus-blog-core';

  const { series, currentPostIdx } = defineProps<{
    series: SeriesItemInPost;
    currentPostIdx: number;
  }>();

  const isExpanded = ref(false);

  const posts = computed(() =>
    [...series.posts]
      .map((post) => ({ ...post, postIdx: Number(post.postIdx) }))
      .sort((a, b) => a.postIdx - b.postIdx),
  );

  const currentIndex = computed(() =>
    posts.value.findIndex((post) => post.postIdx === currentPostIdx),
  );

  /** 접힌 상태에서는 현재 편 앞뒤 1편씩만 보여준다 */
  const collapsedIndices = computed(() => {
    const list = posts.value;
    const index = currentIndex.value;

    if (index < 0 || list.length <= 1) return list.map((_, i) => i);
    if (index === 0) return [0, 1].filter((i) => i < list.length);
    if (index === list.length - 1) return [list.length - 2, list.length - 1];
    return [index - 1, index, index + 1];
  });

  const visibleIndices = computed(() =>
    isExpanded.value ? posts.value.map((_, i) => i) : collapsedIndices.value,
  );

  const canToggle = computed(() => collapsedIndices.value.length < posts.value.length);
</script>

<template>
  <section class="glass flex flex-col gap-3.5 rounded-xl p-5.5" aria-label="시리즈">
    <div class="flex items-baseline justify-between gap-3">
      <NuxtLink
        :to="{ name: 'series-slug', params: { slug: series.slug } }"
        class="font-display text-[15px] font-bold hover:opacity-80"
      >
        시리즈 · {{ series.name }}
      </NuxtLink>
      <span class="text-fg-40 shrink-0 font-mono text-[11px] font-medium">
        {{ series.postCount ?? posts.length }}편
      </span>
    </div>

    <ul class="flex flex-col gap-1.5">
      <li v-for="index in visibleIndices" :key="posts[index]!.postIdx">
        <component
          :is="posts[index]!.postIdx === currentPostIdx ? 'div' : 'NuxtLink'"
          :to="posts[index]!.postIdx === currentPostIdx ? undefined : postPath(posts[index]!)"
          :aria-current="posts[index]!.postIdx === currentPostIdx ? 'page' : undefined"
          :class="
            cn(
              'border-border flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
              posts[index]!.postIdx === currentPostIdx
                ? 'bg-[oklch(0.785_0.104_69.8/0.14)]'
                : 'bg-glass-2 hover:bg-glass-hover',
            )
          "
        >
          <span
            :class="
              cn(
                'w-4 shrink-0 font-mono text-[11px] font-semibold',
                posts[index]!.postIdx === currentPostIdx ? 'text-primary' : 'text-fg-40',
              )
            "
          >
            {{ index + 1 }}
          </span>
          <span class="text-fg-80 min-w-0 flex-1 text-[13px] leading-[1.45]">
            {{ posts[index]!.title }}
          </span>
          <span
            v-if="posts[index]!.postIdx === currentPostIdx"
            class="text-primary shrink-0 font-mono text-[10.5px]"
          >
            현재
          </span>
        </component>
      </li>
    </ul>

    <button
      v-if="canToggle"
      type="button"
      class="text-fg-50 hover:text-foreground flex cursor-pointer items-center gap-1.5 text-[12px] transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <Icon
        name="lucide:chevron-down"
        :class="cn('size-4 transition-transform', isExpanded && 'rotate-180')"
      />
      {{ isExpanded ? '접기' : `전체 ${posts.length}편 보기` }}
    </button>
  </section>
</template>
