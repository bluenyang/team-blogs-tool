<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();

  const idxParam = route.params.idx as string;
  const postIdx = parseInt(idxParam, 10);

  const { settings } = useSetting();
  const { post, pending, error } = usePostDetail(postIdx);
  const series = computed(() => post.value?.series?.[0]);
  const seriesName = computed(() => series.value?.name);

  const seriesOrder = computed(() => {
    if (!series.value || !post.value?.postIdx) return null;
    const index = series.value.posts.findIndex((p) => p.postIdx === post.value?.postIdx);
    return index >= 0 ? index + 1 : null;
  });

  const formattedDate = computed(() => formatPostDateLong(post.value?.publishedAt));

  const categoryName = computed<string>(() => {
    if (!post.value?.categories?.length) {
      return 'Uncategorized';
    }
    return post.value.categories[0]?.name ?? 'Uncategorized';
  });

  const cclLicenseCode = computed(() => getCclLicenseCode(settings.value));

  const canonicalPath = computed(() =>
    post.value ? `/posts/${post.value.postIdx}-${post.value.slug}` : null,
  );
  const canonicalUrl = computed(() =>
    canonicalPath.value ? `${config.public.blogUrl}${canonicalPath.value}` : undefined,
  );

  // /posts/12 와 /posts/12-wrong-slug 를 정규 URL로 합쳐 중복 콘텐츠를 막음
  watch(
    canonicalPath,
    (path) => {
      if (!path || route.path === path) return;
      navigateTo(path, { redirectCode: 301, replace: true });
    },
    { immediate: true },
  );

  function goBack() {
    window.history.back();
  }

  useHead({
    link: () => (canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : []),
  });

  useSeoMeta({
    title: () => post.value?.title || 'Post',
    description: () => post.value?.summary || undefined,
    ogTitle: () => post.value?.title || 'Post',
    ogImage: () => post.value?.thumbnail || undefined,
    ogDescription: () => post.value?.summary || undefined,
    ogUrl: canonicalUrl,
    ogType: 'article',
    ogLocale: 'ko_KR',
    ogSiteName: () => useBlogBrand().siteName.value,
    twitterCard: 'summary_large_image',
    articlePublishedTime: () => post.value?.publishedAt,
    articleModifiedTime: () => post.value?.updatedAt,
  });
</script>

<template>
  <div class="w-full px-4 py-32 sm:px-6 lg:px-8">
    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <div
      v-else-if="error || !post"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">{{ '게시글을 찾을 수 없습니다.' }}</p>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <button
        class="text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1 transition-colors hover:underline"
        @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        <span class="mt-0.5">
          {{ '이전으로 돌아가기' }}
        </span>
      </button>
      <!-- Hero Section -->
      <div class="mb-8 flex flex-col items-start text-center">
        <!-- Thumbnail -->
        <div
          v-if="post.thumbnail"
          class="relative mb-8 w-full max-w-4xl overflow-hidden rounded-2xl bg-linear-to-br shadow-lg md:from-blue-200 md:to-purple-300 dark:md:from-blue-800 dark:md:to-purple-900"
        >
          <img :src="post.thumbnail" :alt="post.title" class="aspect-2/1 w-full object-cover" />
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex flex-wrap items-center justify-start gap-2 text-sm">
            <span class="text-muted-foreground font-bold">{{ categoryName }}</span>
            <template v-if="series">
              <div class="flex items-center gap-1">
                <span class="text-muted-foreground">
                  {{ '·' }}
                </span>
                <NuxtLink
                  :to="{ name: 'series-slug', params: { slug: series.slug } }"
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon name="lucide:layers" class="mr-1 mb-0.5 inline size-4" />
                  {{ `${seriesName} (${seriesOrder}편)` }}
                </NuxtLink>
              </div>
            </template>
          </div>

          <h1 class="mb-6 text-start text-3xl leading-tight font-bold sm:text-5xl">
            {{ post.title }}
          </h1>

          <div class="text-muted-foreground mb-6 flex items-center justify-start gap-2 text-sm">
            <div class="flex items-center gap-2">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar"
                alt="Author Avatar"
                class="size-6 rounded-full"
              />
              <div
                v-else
                class="bg-block-bg text-foreground flex size-6 items-center justify-center rounded-full"
              >
                <Icon name="lucide:user" class="size-4" />
              </div>
              <span class="font-medium">{{ post.author.nickname }}</span>
            </div>
            <span>{{ '·' }}</span>
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar-days" class="size-4" />
              <time :datetime="post.publishedAt || ''">{{ formattedDate }}</time>
            </div>
            <template v-if="settings?.allowCCL">
              <span>{{ '·' }}</span>
              <NuxtLink to="/license" class="hover:text-foreground transition-colors">
                <CclBadge />
              </NuxtLink>
            </template>
          </div>
        </div>

        <div
          v-if="post.tags && post.tags.length > 0"
          class="flex flex-wrap items-center justify-center gap-2"
        >
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag.slug"
            :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
            class="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
          >
            {{ `# ${tag.name}` }}
          </NuxtLink>
        </div>
      </div>

      <MarkdownContent
        v-if="post"
        :post-content="post.content"
        :post-idx="post.postIdx"
        :series="series"
        :current-post-idx="post.postIdx"
      />

      <footer class="border-border mt-12 max-w-7xl border-t pt-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-center gap-3">
            <img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              alt="Author Avatar"
              class="size-12 rounded-full"
            />
            <div
              v-else
              class="bg-block-bg text-foreground flex size-12 items-center justify-center rounded-full"
            >
              <Icon name="lucide:user" class="size-6" />
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">
                {{ '작성자' }}
              </span>
              <span class="text-foreground text-base font-semibold">
                {{ post.author.nickname }}
              </span>
            </div>
          </div>

          <div v-if="settings?.allowCCL" class="flex flex-col gap-2 sm:items-end">
            <span class="text-muted-foreground text-xs tracking-wide uppercase">
              {{ '라이선스' }}
            </span>
            <NuxtLink
              to="/license"
              class="text-muted-foreground hover:text-primary inline-flex flex-wrap items-center gap-2 transition-colors sm:justify-end"
            >
              <CclBadge />
              <span class="text-sm">{{ cclLicenseCode }}</span>
              <Icon name="lucide:arrow-up-right" class="size-3.5" />
            </NuxtLink>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
