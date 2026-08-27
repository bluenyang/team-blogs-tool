<script setup lang="ts">
  const { siteName } = useBlogBrand();

  useHead({
    titleTemplate: computed(() => `%s · ${siteName.value}`),
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: computed(() => `${siteName.value} RSS Feed`),
        href: '/rss.xml',
      },
    ],
  });
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="oklch(58.8% 0.158 241.966)" :height="4" :throttle="100" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!--
        페이지 전환 애니메이션은 두지 않는다. 글 상세처럼 setup에서 top-level await을 쓰는
        페이지와 <Transition mode="out-in">이 겹치면 leave 훅이 깨져 이전 페이지가 남는다.
      -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
