<script setup lang="ts">
  const route = useRoute();
  const router = useRouter();
  const { siteName, description, blogUrl } = useBlogBrand();
  const { sidebar } = useSidebar();

  const limit = 10;

  // 페이지 번호를 URL에 두어 뒤로가기·공유·크롤링이 모두 동작하게 한다
  const currentPage = computed({
    get: () => Math.max(Number(route.query.page) || 1, 1),
    set: (page: number) => {
      router.push({ query: { ...route.query, page: page > 1 ? String(page) : undefined } });
    },
  });

  const { posts, pending, error, totalCount } = usePostList(limit, currentPage);

  const topCategories = computed(() => sidebar.value?.categories.items.slice(0, 5) ?? []);
  const totalPosts = computed(() => sidebar.value?.profile.totalPosts ?? totalCount.value);
  const totalPages = computed(() => Math.max(Math.ceil(totalCount.value / limit), 1));

  const canonicalUrl = computed(() => `${blogUrl.value}/posts`);

  const prevHref = computed(() => {
    if (currentPage.value <= 1) return null;
    return currentPage.value === 2
      ? canonicalUrl.value
      : `${canonicalUrl.value}?page=${currentPage.value - 1}`;
  });
  const nextHref = computed(() =>
    currentPage.value < totalPages.value
      ? `${canonicalUrl.value}?page=${currentPage.value + 1}`
      : null,
  );

  useHead({
    // 페이지네이션은 rel=prev/next로 이어 붙이고, 2페이지 이후 canonical은 자기 자신을 가리킨다
    link: () => [
      {
        rel: 'canonical' as const,
        href:
          currentPage.value > 1
            ? `${canonicalUrl.value}?page=${currentPage.value}`
            : canonicalUrl.value,
      },
      ...(prevHref.value ? [{ rel: 'prev' as const, href: prevHref.value }] : []),
      ...(nextHref.value ? [{ rel: 'next' as const, href: nextHref.value }] : []),
    ],
  });

  useSeoMeta({
    title: () => (currentPage.value > 1 ? `전체 글 (${currentPage.value}페이지)` : '전체 글'),
    description,
    ogTitle: '전체 글',
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    // 2페이지 이후는 thin/duplicate라 색인하지 않고 링크만 따라가게 한다
    robots: () => (currentPage.value > 1 ? 'noindex, follow' : undefined),
  });
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-7xl items-start gap-7 px-5 pt-2 pb-11.5 sm:px-10 lg:grid-cols-[284px_1fr]"
  >
    <div class="sticky top-21 hidden lg:block">
      <BlogSidebar />
    </div>

    <div class="flex min-w-0 flex-col gap-3.5">
      <header class="mb-2.5 flex flex-col gap-1.75">
        <h1 class="font-display text-[28px] font-extrabold tracking-[-0.03em]">전체 글</h1>
        <p class="text-fg-50 text-[13px]">
          {{ totalPosts }}편 · 카테고리와 태그로 좁혀 볼 수 있습니다.
        </p>
      </header>

      <!-- 카테고리 필터 칩 -->
      <div class="-mx-5 mb-1 flex gap-2.25 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <NuxtLink
          to="/posts"
          class="chip chip-active shrink-0 rounded-full px-3.5 py-2 text-[12px]"
        >
          전체 {{ totalPosts }}
        </NuxtLink>
        <NuxtLink
          v-for="category in topCategories"
          :key="category.slug"
          :to="{ name: 'categories-slug', params: { slug: category.slug } }"
          class="chip shrink-0 rounded-full px-3.5 py-2 text-[12px]"
        >
          {{ category.name }} {{ category.postCount ?? 0 }}
        </NuxtLink>
      </div>

      <PostSkeleton v-if="pending && !posts.length" variant="row" :count="4" />

      <EmptyState
        v-else-if="error"
        icon="lucide:alert-circle"
        tone="error"
        title="게시글을 불러오지 못했습니다."
        :description="error.message"
      />

      <EmptyState
        v-else-if="!posts.length"
        icon="lucide:file-text"
        title="등록된 게시글이 없습니다."
      />

      <template v-else>
        <PostRow v-for="post in posts" :key="post.postIdx" :post="post" />
        <Pagination v-model:current="currentPage" :total="totalCount" :limit="limit" />
      </template>
    </div>
  </div>
</template>
