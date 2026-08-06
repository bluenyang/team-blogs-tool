<script setup lang="ts">
  interface SeriesBoxProps {
    series: SeriesItemInPost;
    currentPostIdx: number;
  }

  const { series, currentPostIdx } = defineProps<SeriesBoxProps>();
  const { onNavigate, isPending } = useNavFeedback();

  const isExpanded = ref(false);

  const posts = computed(() => {
    const tempPosts = series.posts.map((post) => ({
      ...post,
      postIdx: Number(post.postIdx),
    }));

    return tempPosts.sort((a, b) => a.postIdx - b.postIdx);
  });

  const currentIndex = computed(() =>
    posts.value.findIndex((post) => post.postIdx === currentPostIdx),
  );

  const collapsedIndices = computed(() => {
    const list = posts.value;
    const index = currentIndex.value;

    if (index < 0 || list.length <= 1) {
      return list.map((_, i) => i);
    }
    if (index === 0) {
      return [0, 1].filter((i) => i < list.length);
    }
    if (index === list.length - 1) {
      return [list.length - 2, list.length - 1];
    }
    return [index - 1, index, index + 1];
  });

  const visibleIndices = computed(() =>
    isExpanded.value ? posts.value.map((_, i) => i) : collapsedIndices.value,
  );

  const canToggle = computed(() => collapsedIndices.value.length < posts.value.length);

  const hasHiddenBefore = computed(() => !isExpanded.value && (visibleIndices.value[0] ?? 0) > 0);

  const hasHiddenAfter = computed(
    () =>
      !isExpanded.value &&
      (visibleIndices.value[visibleIndices.value.length - 1] ?? 0) < posts.value.length - 1,
  );
</script>

<template>
  <div class="border-border bg-block-bg mb-12 rounded-xl border p-6">
    <div class="text-muted-foreground font-jua mb-4 flex items-center text-sm">
      <Icon name="lucide:layers" class="mr-2 size-4" />
      <span>{{ '시리즈' }}</span>
      <span class="px-2">{{ '·' }}</span>
      <span>{{ series.name }}</span>
      <span class="ml-2 text-sm font-normal">
        {{ `(${series.postCount}개의 글)` }}
      </span>
    </div>
    <ul class="space-y-2 ps-4">
      <li v-if="hasHiddenBefore" class="text-muted-foreground ps-7 text-sm">···</li>
      <li
        v-for="index in visibleIndices"
        :key="posts[index]!.postIdx"
        class="flex items-start text-sm"
      >
        <span class="text-muted-foreground font-jua mt-0.5 mr-4">{{ index + 1 }}.</span>
        <NuxtLink
          v-if="posts[index]!.postIdx !== currentPostIdx"
          :to="`/posts/${posts[index]!.postIdx}-${posts[index]!.slug}`"
          :aria-busy="isPending(`post-${posts[index]!.postIdx}`)"
          :class="
            cn(
              'text-muted-foreground hover:text-primary underline-offset-4 transition-all hover:underline',
              isPending(`post-${posts[index]!.postIdx}`) && 'pointer-events-none opacity-60',
            )
          "
          @click="onNavigate(`post-${posts[index]!.postIdx}`)"
        >
          {{ posts[index]!.title }}
        </NuxtLink>
        <span v-else class="text-foreground flex w-full items-center justify-between">
          <span class="font-bold">
            {{ posts[index]!.title }}
          </span>
          <span class="me-4">
            {{ '현재' }}
          </span>
        </span>
      </li>
      <li v-if="hasHiddenAfter" class="text-muted-foreground ps-7 text-sm">···</li>
    </ul>
    <button
      v-if="canToggle"
      type="button"
      class="text-muted-foreground hover:text-primary mt-4 flex items-center gap-1 ps-4 text-sm transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <Icon
        name="lucide:chevron-down"
        class="size-4 transition-transform"
        :class="{ 'rotate-180': isExpanded }"
      />
      <span>{{ isExpanded ? '접기' : `전체 ${series.postCount}개 보기` }}</span>
    </button>
  </div>
</template>
