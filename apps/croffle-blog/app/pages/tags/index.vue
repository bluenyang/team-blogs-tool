<script setup lang="ts">
  const { sidebar, pending, error } = useSidebar();
  const { siteName, blogUrl } = useBlogBrand();

  const tags = computed(() =>
    [...(sidebar.value?.tags.items ?? [])].sort(
      (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0) || a.name.localeCompare(b.name),
    ),
  );

  const maxCount = computed(() => Math.max(...tags.value.map((t) => t.postCount ?? 0), 1));

  /** 글 수에 따라 12px → 18px로 커지는 태그 클라우드 */
  function fontSize(count: number | undefined) {
    const ratio = Math.min((count ?? 0) / maxCount.value, 1);
    return `${(12 + ratio * 6).toFixed(1)}px`;
  }

  const canonicalUrl = computed(() => `${blogUrl.value}/tags`);
  const pageDesc = '글이 많은 태그가 더 크게 보입니다.';

  useHead({ link: () => [{ rel: 'canonical', href: canonicalUrl.value }] });

  useSeoMeta({
    title: '태그',
    description: pageDesc,
    ogTitle: '태그',
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 pt-4 pb-11.5 sm:px-10">
    <header class="flex flex-col gap-2 pb-6">
      <h1 class="font-display text-[30px] font-extrabold tracking-[-0.03em]">태그</h1>
      <p class="text-fg-50 text-[13.5px] leading-[1.7]">{{ pageDesc }}</p>
    </header>

    <div v-if="pending && !tags.length" class="flex flex-wrap gap-2.5">
      <div v-for="i in 14" :key="i" class="skeleton h-10 w-24 rounded-xl" />
    </div>

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="태그를 불러오지 못했습니다."
      :description="error.message"
    />

    <EmptyState v-else-if="!tags.length" icon="lucide:tag" title="등록된 태그가 없습니다." />

    <div v-else class="flex flex-wrap items-center gap-2.5">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.slug"
        :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
        class="chip text-fg-80 flex min-h-11 items-baseline gap-2 rounded-xl px-3.75 py-2.25"
        :style="{ fontSize: fontSize(tag.postCount) }"
      >
        {{ tag.name }}
        <span class="text-fg-35 text-[11px]">{{ tag.postCount ?? 0 }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
