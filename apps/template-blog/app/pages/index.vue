<script setup lang="ts">
  const { recentPosts, popularSeries, pending, error } = useHome();
  const { siteName, description } = useBlogBrand();
  const config = useRuntimeConfig();

  const canonicalUrl = config.public.blogUrl as string;

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title: 'Home',
    description,
    ogTitle: siteName,
    ogImage: `${canonicalUrl}/favicon.ico`,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });
</script>

<template>
  <main class="w-full">
    <BannerHero />

    <!-- 최신 글 섹션 -->
    <section class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-12 flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">최신 글</h2>
          <p class="text-muted-foreground mt-3 text-lg">
            블로그에 새롭게 올라온 이야기를 만나보세요.
          </p>
        </div>
        <NuxtLink
          to="/posts"
          class="text-primary hover:text-primary/80 hidden text-sm font-semibold transition-colors sm:flex sm:items-center"
        >
          <span>최신 글 전체 보기</span>
          <Icon name="lucide:arrow-right" class="ml-1 size-4" />
        </NuxtLink>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="pending" class="flex justify-center py-24">
        <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
        <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
        <p class="text-destructive text-lg">게시글을 불러오는데 실패했습니다.</p>
        <p class="text-muted-foreground text-sm">{{ error.message }}</p>
      </div>

      <!-- 빈 목록 상태 -->
      <div
        v-else-if="recentPosts.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <Icon name="lucide:file-text" class="text-muted-foreground mb-4 size-12" />
        <p class="text-muted-foreground text-lg">등록된 게시글이 없습니다.</p>
      </div>

      <!-- 게시글 그리드 -->
      <div
        v-else
        class="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 xl:gap-x-8"
      >
        <PostCard v-for="post in recentPosts" :key="post.slug" :post="post" />
      </div>

      <!-- 모바일 전체 보기 버튼 -->
      <div class="mt-10 sm:hidden">
        <NuxtLink
          to="/posts"
          class="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors"
        >
          최신 글 전체 보기
        </NuxtLink>
      </div>
    </section>

    <!-- 시리즈 섹션 -->
    <section class="bg-muted/30 py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 flex items-end justify-between">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">시리즈</h2>
            <p class="text-muted-foreground mt-3 text-lg">주제별로 묶인 연재 글을 확인해 보세요.</p>
          </div>
        </div>

        <div v-if="pending" class="flex justify-center py-24">
          <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
          <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
          <p class="text-destructive text-lg">시리즈를 불러오는데 실패했습니다.</p>
          <p class="text-muted-foreground text-sm">{{ error.message }}</p>
        </div>

        <div
          v-else-if="popularSeries.length === 0"
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <Icon name="lucide:layers" class="text-muted-foreground mb-4 size-12" />
          <p class="text-muted-foreground text-lg">등록된 시리즈가 없습니다.</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in popularSeries"
            :key="item.slug"
            :to="{ name: 'series-slug', params: { slug: item.slug } }"
            class="group bg-card hover:bg-card-hover hover:border-border flex flex-col overflow-hidden rounded-2xl border border-transparent transition-all"
          >
            <div class="bg-muted h-2 w-full"></div>
            <div class="flex flex-1 flex-col p-5">
              <h3
                class="text-foreground group-hover:text-muted-foreground mb-3 line-clamp-2 text-xl font-bold tracking-tight transition-colors"
              >
                {{ item.name }}
              </h3>
              <p class="text-muted-foreground mb-5 line-clamp-2 text-sm leading-relaxed">
                {{ item.description || '이 시리즈에 대한 설명이 없습니다.' }}
              </p>
              <div class="text-muted-foreground mt-auto flex items-center text-sm">
                <Icon name="lucide:layers" class="mr-2 size-4" />
                <span>{{ `${item.postCount || 0}개의 글` }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
