<script setup lang="ts">
  const { authors, pending, error } = useAuthors();
  const { siteName, description, blogUrl } = useBlogBrand();

  const canonicalUrl = computed(() => `${blogUrl.value}/authors`);
  const pageDesc = '이 블로그에 글을 쓰는 사람들과 각자의 아카이브.';

  useHead({
    link: () => [{ rel: 'canonical', href: canonicalUrl.value }],
  });

  useSeoMeta({
    title: '글쓴이',
    description: pageDesc,
    ogTitle: '글쓴이',
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '글쓴이',
    itemListElement: authors.value.map((author, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${blogUrl.value}/authors/${encodeURIComponent(author.slug)}`,
      name: author.nickname,
    })),
  }));
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 pt-4 pb-11.5 sm:px-10">
    <header class="flex flex-col gap-2 pb-6">
      <h1 class="font-display text-[30px] font-extrabold tracking-[-0.03em]">글쓴이</h1>
      <p class="text-fg-50 text-[13.5px] leading-[1.7]">{{ description }}</p>
    </header>

    <div
      v-if="pending && !authors.length"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="glass flex animate-pulse flex-col items-center gap-2.5 rounded-2xl px-4 py-5"
      >
        <div class="skeleton size-14 rounded-full" />
        <div class="skeleton h-4 w-20" />
        <div class="skeleton h-3 w-24" />
      </div>
    </div>

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="글쓴이 정보를 불러오지 못했습니다."
      :description="error.message"
    />

    <EmptyState v-else-if="!authors.length" icon="lucide:users" title="등록된 글쓴이가 없습니다." />

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <AuthorCard v-for="author in authors" :key="author.id" :author="author" />
    </div>
  </div>
</template>
