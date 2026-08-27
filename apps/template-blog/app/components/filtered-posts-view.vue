<script setup lang="ts">
  const props = defineProps<{
    search?: string;
    category?: string;
    tag?: string;
    series?: string;
  }>();

  const config = useRuntimeConfig();
  const { siteName } = useBlogBrand();

  const limit = 10;
  const currentPage = ref(1);
  const { onNavigate, isPending } = useNavFeedback();

  const options = computed(() => {
    return {
      search: props.search,
      category: props.category,
      tag: props.tag,
      series: props.series,
    };
  });

  watch(
    () => [props.search, props.category, props.tag, props.series],
    () => {
      currentPage.value = 1;
    },
  );

  const { posts, pending, error, metadata, totalCount } = usePostList(limit, currentPage, {
    search: () => options.value.search,
    category: () => options.value.category,
    tag: () => options.value.tag,
    series: () => options.value.series,
  });

  // API searchType보다 props로 타입을 정해 SSR/클라이언트 헤더가 어긋나지 않게 함
  const resolvedType = computed(() => {
    if (options.value.search) {
      return 'search';
    } else if (options.value.category && !options.value.series && !options.value.tag) {
      return 'category';
    } else if (options.value.tag && !options.value.series && !options.value.category) {
      return 'tag';
    } else if (options.value.series && !options.value.category && !options.value.tag) {
      return 'series';
    } else if (
      !options.value.search &&
      !options.value.category &&
      !options.value.tag &&
      !options.value.series
    ) {
      return null;
    } else {
      return 'search';
    }
  });

  const eyebrow = computed(() => {
    if (resolvedType.value === 'series') {
      return 'Series';
    }
    if (resolvedType.value === 'category') {
      return 'Category';
    }
    if (resolvedType.value === 'tag') {
      return 'Tag';
    }
    return 'Search';
  });

  const iconName = computed(() => {
    if (resolvedType.value === 'series') {
      return 'lucide:layers';
    }
    if (resolvedType.value === 'category') {
      return 'lucide:folder';
    }
    if (resolvedType.value === 'tag') {
      return 'lucide:tag';
    }
    return 'lucide:search';
  });

  const pageTitle = computed(() => {
    if (resolvedType.value === 'series') {
      return metadata.value?.name ? `${metadata.value.name} 시리즈` : '시리즈';
    }
    if (resolvedType.value === 'category') {
      return metadata.value?.name ? `카테고리 · ${metadata.value.name}` : '카테고리';
    }
    if (resolvedType.value === 'tag') {
      return metadata.value?.name ? `태그 · #${metadata.value.name}` : '태그';
    }
    return options.value.search ? `"${options.value.search}" 검색 결과` : '검색 결과';
  });

  const pageDesc = computed(() => {
    const count = metadata.value?.totalCount;
    if (resolvedType.value === 'series') {
      return count != null ? `시리즈에 포함된 ${count}개의 글` : '';
    }
    if (resolvedType.value === 'category') {
      return count != null ? `카테고리에 포함된 ${count}개의 글` : '';
    }
    if (resolvedType.value === 'tag') {
      return count != null ? `태그가 붙은 ${count}개의 글` : '';
    }
    if (!options.value.search) {
      return '검색어를 입력해 주세요.';
    }
    return count != null ? `총 ${count}개의 글이 검색됐습니다.` : '';
  });

  const pageCanonicalUrl = computed(() => {
    if (resolvedType.value === 'search') {
      const q = options.value.search ? `?search=${encodeURIComponent(options.value.search)}` : '';
      return `${config.public.blogUrl}/search${q}`;
    }
    if (resolvedType.value === 'category') {
      return `${config.public.blogUrl}/categories/${props.category}`;
    }
    if (resolvedType.value === 'tag') {
      return `${config.public.blogUrl}/tags/${props.tag}`;
    }
    if (resolvedType.value === 'series') {
      return `${config.public.blogUrl}/series/${props.series}`;
    }
    return `${config.public.blogUrl}`;
  });

  useHead({
    link: () =>
      resolvedType.value !== 'search' && pageCanonicalUrl.value
        ? [{ rel: 'canonical', href: pageCanonicalUrl.value }]
        : [],
  });

  useSeoMeta({
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogUrl: pageCanonicalUrl,
    ogImage: () =>
      resolvedType.value === 'series'
        ? metadata.value?.thumbnail
        : `${config.public.blogUrl}/favicon.ico`,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    // 검색 결과 페이지는 색인하지 않아 thin/duplicate를 피함
    robots: () => (resolvedType.value === 'search' ? 'noindex, follow' : undefined),
  });

  function getFormattedDate(dateString: string | null) {
    return formatPostDateYmd(dateString);
  }

  function getCategory(post: PostItem) {
    if (!post.categories || post.categories.length === 0) {
      return 'Uncategorized';
    }
    return post.categories[0] ?? 'Uncategorized';
  }

  const currentPageText = computed(() => {
    return `총 ${Math.ceil(totalCount.value / limit)}페이지 중 ${currentPage.value}페이지`;
  });
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <div
      v-if="resolvedType === 'series' && metadata?.thumbnail"
      class="mb-8 w-full overflow-hidden rounded-2xl shadow-md"
    >
      <img
        :src="metadata?.thumbnail"
        :alt="metadata?.name ?? ''"
        class="aspect-3/1 w-full object-cover"
      />
    </div>

    <div class="border-border border-b-2 pb-2">
      <div class="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Icon :name="iconName" class="size-4" />
        <span class="tracking-widest uppercase">{{ eyebrow }}</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ pageTitle }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">
        {{ resolvedType === 'series' ? metadata?.description : pageDesc }}
      </p>
      <p class="text-muted-foreground mt-3 text-end text-base">{{ currentPageText }}</p>
    </div>

    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">게시글을 불러오는데 실패했습니다.</p>
      <p class="text-muted-foreground text-sm">{{ error.message }}</p>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:search-x" class="text-muted-foreground mb-4 size-12" />
      <p class="text-muted-foreground text-lg">
        {{ resolvedType === 'search' ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.' }}
      </p>
    </div>

    <template v-else>
      <div class="divide-border flex flex-col divide-y">
        <NuxtLink
          v-for="post in posts"
          :key="post.postIdx"
          :to="`/posts/${post.postIdx}-${post.slug}`"
          :aria-busy="isPending(`post-${post.postIdx}`)"
          :class="
            cn(
              'group hover:bg-card relative flex flex-col transition-opacity sm:flex-row sm:justify-between',
              isPending(`post-${post.postIdx}`) && 'pointer-events-none opacity-60',
            )
          "
          @click="onNavigate(`post-${post.postIdx}`)"
        >
          <div
            class="flex-1 p-4 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-linear-to-b before:from-sky-500 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100 sm:py-8"
          >
            <div
              class="text-muted-foreground mb-2 flex flex-col-reverse items-start text-sm sm:flex-row sm:items-center"
            >
              <span class="text-primary font-semibold">{{ getCategory(post) }}</span>
              <span class="ms-2 hidden sm:inline">·</span>
              <span class="ms-2 text-xs">{{ `No. ${post.postIdx}` }}</span>
              <template v-if="resolvedType !== 'series' && post.series && post.series.length > 0">
                <span class="ms-2 hidden sm:inline">·</span>
                <span class="text-muted-foreground ms-2 flex items-center gap-1 text-xs">
                  <Icon name="lucide:layers" class="size-3" />
                  {{ post.series[0] }}
                </span>
              </template>
            </div>
            <h3
              class="text-foreground group-hover:text-muted-foreground mb-2 text-xl font-bold tracking-tight transition-colors"
            >
              {{ post.title }}
            </h3>
            <p class="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
              {{ post.summary || '' }}
            </p>
            <div v-if="post.tags && post.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
              <span
                v-for="tagName in post.tags"
                :key="tagName"
                class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
              >
                {{ `#${tagName}` }}
              </span>
            </div>
          </div>

          <div class="text-muted-foreground flex items-center gap-1 p-4 sm:shrink-0">
            <Icon name="lucide:clock" class="text-muted-foreground mb-0.5 size-4" />
            <time :datetime="post.publishedAt || ''" class="text-sm">
              {{ getFormattedDate(post.publishedAt) }}
            </time>
          </div>
        </NuxtLink>
      </div>

      <Pagination
        v-model:current="currentPage"
        :total="metadata?.totalCount ?? totalCount"
        :limit="limit"
      />
    </template>
  </main>
</template>
