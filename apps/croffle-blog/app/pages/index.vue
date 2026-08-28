<script setup lang="ts">
  const { recentPosts, pending, error } = useHome();
  const { authors, pending: authorsPending } = useAuthors();
  const { siteName, description, blogUrl } = useBlogBrand();

  // 피처드 = 최신 1편. Directus에 추천 플래그가 없어 발행 순서를 그대로 쓴다.
  const featured = computed(() => recentPosts.value[0]);
  const rest = computed(() => recentPosts.value.slice(1, 7));

  const heroLead = computed(() => description.value.split(/(?<=[.!?])\s+/)[0] ?? description.value);

  useHead({
    link: [{ rel: 'canonical', href: blogUrl.value || '/' }],
  });

  useSeoMeta({
    title: 'Home',
    description,
    ogTitle: siteName,
    ogDescription: description,
    ogUrl: blogUrl,
    ogImage: () => featured.value?.thumbnail || `${blogUrl.value}/images/croffle-logo.png`,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
  });

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: siteName.value,
    description: description.value,
    url: blogUrl.value,
    blogPost: recentPosts.value.slice(0, 6).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${blogUrl.value}${postPath(post)}`,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: authorDisplayName(post.author) },
    })),
  }));
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 sm:px-10">
    <!-- 히어로 -->
    <section class="flex flex-col items-center gap-3.5 px-2 pt-7 pb-5 text-center sm:pt-11">
      <span
        class="border-border-strong bg-glass-2 text-fg-60 rounded-full border px-3.5 py-1.5 font-mono text-[12px] font-medium"
      >
        작은 개발팀의 큰 기록
      </span>
      <h1
        class="font-display sm:text-hero text-[29px] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance sm:tracking-[-0.035em]"
      >
        우리가 만들면서<br />
        <span class="text-primary">배운 것들</span>
      </h1>
      <p class="text-fg-50 max-w-xl text-[13px] leading-[1.7] text-pretty sm:text-[14.5px]">
        {{ heroLead }}
      </p>
    </section>

    <!-- 피처드 -->
    <section class="pt-4 sm:pt-5.5">
      <PostSkeleton v-if="pending && !featured" variant="featured" />
      <EmptyState
        v-else-if="error"
        icon="lucide:alert-circle"
        tone="error"
        title="글을 불러오지 못했습니다."
        :description="error.message"
      />
      <EmptyState
        v-else-if="!featured"
        icon="lucide:file-text"
        title="아직 발행된 글이 없습니다."
        description="첫 글이 올라오면 여기에 표시됩니다."
      />
      <PostFeaturedCard v-else :post="featured" />
    </section>

    <!-- 최신 글 -->
    <section v-if="pending || rest.length" class="flex flex-col gap-5.5 pt-10 pb-11.5">
      <SectionHeader title="최신 글" more-to="/posts" />
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <PostSkeleton v-if="pending && !rest.length" :count="3" />
        <PostCard v-for="post in rest" :key="post.postIdx" :post="post" />
      </div>
    </section>

    <!-- 글쓴이 -->
    <section v-if="authorsPending || authors.length" class="flex flex-col gap-5 pb-11.5">
      <SectionHeader title="글쓴이" more-to="/authors" more-label="글쓴이 소개" />
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <template v-if="authorsPending && !authors.length">
          <div
            v-for="i in 5"
            :key="i"
            class="glass flex animate-pulse flex-col items-center gap-2.5 rounded-2xl px-4 py-5"
          >
            <div class="skeleton size-14 rounded-full" />
            <div class="skeleton h-4 w-20" />
            <div class="skeleton h-3 w-24" />
          </div>
        </template>
        <AuthorCard v-for="author in authors.slice(0, 5)" :key="author.id" :author="author" />
      </div>
    </section>
  </div>
</template>
