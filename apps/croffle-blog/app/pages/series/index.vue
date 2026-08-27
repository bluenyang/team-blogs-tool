<script setup lang="ts">
  const { sidebar, pending, error } = useSidebar();
  const { siteName, blogUrl } = useBlogBrand();

  const series = computed(() =>
    [...(sidebar.value?.series.items ?? [])].sort(
      (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0) || a.name.localeCompare(b.name),
    ),
  );

  const canonicalUrl = computed(() => `${blogUrl.value}/series`);
  const pageDesc =
    '한 주제를 여러 편에 걸쳐 이어 씁니다. 여러 사람이 한 시리즈에 참여할 수 있습니다.';

  useHead({ link: () => [{ rel: 'canonical', href: canonicalUrl.value }] });

  useSeoMeta({
    title: '시리즈',
    description: pageDesc,
    ogTitle: '시리즈',
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '시리즈',
    itemListElement: series.value.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${blogUrl.value}/series/${encodeURIComponent(item.slug)}`,
      name: item.name,
    })),
  }));
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 pt-4 pb-11.5 sm:px-10">
    <header class="flex flex-col gap-2 pb-6">
      <h1 class="font-display text-[30px] font-extrabold tracking-[-0.03em]">시리즈</h1>
      <p class="text-fg-50 text-[13.5px] leading-[1.7]">{{ pageDesc }}</p>
    </header>

    <div v-if="pending && !series.length" class="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="glass animate-pulse overflow-hidden rounded-xl">
        <div class="bg-primary/40 h-1.25" />
        <div class="flex flex-col gap-3 p-5">
          <div class="skeleton h-3 w-24" />
          <div class="skeleton h-6 w-3/4" />
          <div class="skeleton h-4 w-full" />
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="시리즈를 불러오지 못했습니다."
      :description="error.message"
    />

    <EmptyState v-else-if="!series.length" icon="lucide:layers" title="등록된 시리즈가 없습니다." />

    <div v-else class="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="item in series"
        :key="item.slug"
        :to="{ name: 'series-slug', params: { slug: item.slug } }"
        class="glass glass-interactive flex flex-col overflow-hidden rounded-xl"
      >
        <div class="bg-primary h-1.25 shrink-0" />
        <div class="flex flex-1 flex-col gap-2.75 p-5">
          <span class="text-fg-40 font-mono text-[10.5px] font-medium">
            {{ item.postCount ?? 0 }}편
          </span>
          <h2 class="font-display text-[18px] leading-[1.35] font-bold tracking-[-0.02em]">
            {{ item.name }}
          </h2>
          <p v-if="item.description" class="text-fg-50 text-label line-clamp-3">
            {{ item.description }}
          </p>
          <span class="text-primary mt-auto pt-3 text-[12px] font-semibold">이어 읽기 →</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
