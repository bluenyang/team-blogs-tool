<script setup lang="ts">
  const props = defineProps<{
    search?: string;
    category?: string;
    tag?: string;
    series?: string;
  }>();

  const route = useRoute();
  const router = useRouter();
  const { siteName, blogUrl } = useBlogBrand();

  const limit = 10;

  const currentPage = computed({
    get: () => Math.max(Number(route.query.page) || 1, 1),
    set: (page: number) => {
      router.push({ query: { ...route.query, page: page > 1 ? String(page) : undefined } });
    },
  });

  watch(
    () => [props.search, props.category, props.tag, props.series],
    () => {
      if (currentPage.value !== 1) currentPage.value = 1;
    },
  );

  const { posts, pending, error, metadata, totalCount } = usePostList(limit, currentPage, {
    search: () => props.search,
    category: () => props.category,
    tag: () => props.tag,
    series: () => props.series,
  });

  // API searchType보다 props로 타입을 정해 SSR/클라이언트 헤더가 어긋나지 않게 함
  const resolvedType = computed(() => {
    if (props.search) return 'search';
    if (props.category && !props.series && !props.tag) return 'category';
    if (props.tag && !props.series && !props.category) return 'tag';
    if (props.series && !props.category && !props.tag) return 'series';
    if (!props.search && !props.category && !props.tag && !props.series) return null;
    return 'search';
  });

  const eyebrow = computed(
    () =>
      ({ series: 'SERIES', category: 'CATEGORY', tag: 'TAG', search: 'SEARCH' })[
        resolvedType.value ?? 'search'
      ],
  );

  const iconName = computed(
    () =>
      ({
        series: 'lucide:layers',
        category: 'lucide:folder',
        tag: 'lucide:tag',
        search: 'lucide:search',
      })[resolvedType.value ?? 'search'],
  );

  const pageTitle = computed(() => {
    const name = metadata.value?.name;
    if (resolvedType.value === 'series') return name ? `${name}` : '시리즈';
    if (resolvedType.value === 'category') return name ?? '카테고리';
    if (resolvedType.value === 'tag') return name ? `#${name}` : '태그';
    return props.search ? `"${props.search}" 검색 결과` : '검색';
  });

  const pageDesc = computed(() => {
    const count = metadata.value?.totalCount ?? totalCount.value;
    if (resolvedType.value === 'series') {
      return metadata.value?.description || `이 시리즈의 글 ${count}편`;
    }
    if (resolvedType.value === 'category') return `이 카테고리의 글 ${count}편`;
    if (resolvedType.value === 'tag') return `이 태그가 붙은 글 ${count}편`;
    if (!props.search) return '검색어를 입력해 주세요.';
    return `${count}편이 검색됐습니다.`;
  });

  const canonicalUrl = computed(() => {
    if (resolvedType.value === 'category') return `${blogUrl.value}/categories/${props.category}`;
    if (resolvedType.value === 'tag') return `${blogUrl.value}/tags/${props.tag}`;
    if (resolvedType.value === 'series') return `${blogUrl.value}/series/${props.series}`;
    return `${blogUrl.value}/search`;
  });

  useHead({
    link: () =>
      resolvedType.value !== 'search' ? [{ rel: 'canonical', href: canonicalUrl.value }] : [],
  });

  useSeoMeta({
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogImage: () =>
      resolvedType.value === 'series'
        ? metadata.value?.thumbnail
        : `${blogUrl.value}/images/croffle-logo.png`,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    // 검색 결과와 2페이지 이후는 색인하지 않아 thin/duplicate를 피함
    robots: () =>
      resolvedType.value === 'search' || currentPage.value > 1 ? 'noindex, follow' : undefined,
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
      <div
        v-if="resolvedType === 'series' && metadata?.thumbnail"
        class="glass overflow-hidden rounded-xl"
      >
        <NuxtImg
          :src="metadata.thumbnail"
          :alt="metadata.name ?? ''"
          width="1200"
          height="400"
          sizes="sm:100vw lg:960px"
          class="aspect-3/1 w-full object-cover"
        />
      </div>

      <header class="mb-2.5 flex flex-col gap-2">
        <span
          class="text-fg-40 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-widest"
        >
          <Icon :name="iconName" class="size-3.5" />
          {{ eyebrow }}
        </span>
        <h1 class="font-display text-[28px] font-extrabold tracking-[-0.03em]">{{ pageTitle }}</h1>
        <p class="text-fg-50 text-[13px] leading-[1.7]">{{ pageDesc }}</p>
      </header>

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
        :icon="resolvedType === 'search' ? 'lucide:search-x' : 'lucide:file-text'"
        :title="resolvedType === 'search' ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'"
      />

      <template v-else>
        <PostRow
          v-for="post in posts"
          :key="post.postIdx"
          :post="post"
          :show-series="resolvedType !== 'series'"
        />
        <Pagination
          v-model:current="currentPage"
          :total="metadata?.totalCount ?? totalCount"
          :limit="limit"
        />
      </template>
    </div>
  </div>
</template>
