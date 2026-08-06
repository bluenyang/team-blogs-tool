<script setup lang="ts">
  import type { PostItem } from '@croffledev/directus-blog-core';

  const config = useRuntimeConfig();
  const { siteName, description } = useBlogBrand();

  const limit = 10;
  const currentPage = ref(1);
  const { posts, pending, error, totalCount } = usePostList(limit, currentPage);
  const { onNavigate, isPending } = useNavFeedback();

  function getFormattedDate(dateString: string | null) {
    return formatPostDateYmd(dateString);
  }

  function getCategory(post: PostItem) {
    if (!post.categories || post.categories.length === 0) {
      return 'Uncategorized';
    }
    return post.categories[0] || 'Uncategorized';
  }

  const currentPageText = computed(() => {
    return `총 ${Math.ceil(totalCount.value / limit)}페이지 중 ${currentPage.value}페이지`;
  });

  const canonicalUrl = `${config.public.blogUrl}/posts`;

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title: 'All Posts',
    description,
    ogTitle: 'All Posts',
    ogImage: `${config.public.blogUrl}/favicon.ico`,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <div class="border-border border-b-2 pb-2">
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ '전체 글' }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">
        {{ '지금까지 작성된 모든 글을 확인해 보세요.' }}
      </p>
      <p class="text-muted-foreground mt-4 text-end text-base">{{ currentPageText }}</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">{{ '게시글을 불러오는데 실패했습니다.' }}</p>
      <p class="text-muted-foreground text-sm">{{ error.message }}</p>
    </div>

    <!-- 빈 목록 상태 -->
    <div
      v-else-if="posts.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:file-text" class="text-muted-foreground mb-4 size-12" />
      <p class="text-muted-foreground text-lg">{{ '등록된 게시글이 없습니다.' }}</p>
    </div>

    <!-- 리스트 형태 게시글 -->
    <template v-else>
      <div class="divide-border flex flex-col divide-y">
        <NuxtLink
          v-for="post in posts"
          :key="post.slug"
          :to="`/posts/${post.postIdx}-${post.slug}`"
          :aria-busy="isPending(`post-${post.slug}`)"
          :class="
            cn(
              'group hover:bg-card relative flex flex-col transition-opacity sm:flex-row sm:justify-between',
              isPending(`post-${post.slug}`) && 'pointer-events-none opacity-60',
            )
          "
          @click="onNavigate(`post-${post.slug}`)"
        >
          <div
            class="flex-1 p-4 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-linear-to-b before:from-sky-500 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100 sm:py-8"
          >
            <div
              class="text-muted-foreground mb-2 flex flex-col-reverse items-start text-sm sm:flex-row sm:items-center"
            >
              <span class="text-primary font-semibold">{{ getCategory(post) }}</span>
              <span class="ms-2 hidden sm:inline">{{ '·' }}</span>
              <span class="ms-2 text-xs">{{ `No. ${post.postIdx}` }}</span>
            </div>
            <h3
              class="text-foreground group-hover:text-muted-foreground mb-2 text-xl font-bold tracking-tight transition-colors"
            >
              {{ post.title }}
            </h3>
            <p class="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
              {{ post.summary || '' }}
            </p>
          </div>
          <div class="text-muted-foreground flex items-center gap-1 p-4">
            <Icon name="lucide:clock" class="text-muted-foreground mb-0.5 size-4" />
            <time :datetime="post.publishedAt || ''" class="text-sm">
              {{ getFormattedDate(post.publishedAt) }}
            </time>
          </div>
        </NuxtLink>
      </div>

      <Pagination v-model:current="currentPage" :total="totalCount" :limit="limit" />
    </template>
  </main>
</template>
