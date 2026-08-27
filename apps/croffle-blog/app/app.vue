<script setup lang="ts">
  const { siteName, description, blogUrl } = useBlogBrand();

  useHead({
    titleTemplate: (title) => (title ? `${title} · ${siteName.value}` : siteName.value),
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: computed(() => `${siteName.value} RSS Feed`),
        href: '/rss.xml',
      },
      { rel: 'icon', type: 'image/png', href: '/images/croffle-logo.png' },
      { rel: 'apple-touch-icon', href: '/images/croffle-logo.png' },
    ],
  });

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName.value,
    description: description.value,
    url: blogUrl.value,
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${blogUrl.value}/search?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }));
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="oklch(0.785 0.104 69.8)" :height="3" :throttle="100" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!--
        페이지 전환 애니메이션은 두지 않는다. 글 상세처럼 setup에서 top-level await을 쓰는
        페이지와 <Transition mode="out-in">이 겹치면 leave 훅이 깨져 이전 페이지가 남는다.
        전환 피드백은 상단 NuxtLoadingIndicator가 담당한다.
      -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
