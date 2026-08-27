<script setup lang="ts">
  const route = useRoute();
  const { siteName, blogUrl, description: blogDescription } = useBlogBrand();
  const { settings } = useSetting();

  const postIdx = Number.parseInt(String(route.params.idx), 10);

  if (!Number.isInteger(postIdx)) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
  }

  const { post, pending, error } = await usePostDetail(postIdx);

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode === 404 ? 404 : 500,
      statusMessage: error.value.statusCode === 404 ? 'Post not found' : 'Failed to load post',
      fatal: true,
    });
  }

  // 본문은 서버에서 파싱한다 — SSR HTML에 본문과 코드 하이라이팅이 그대로 실린다
  const { tree, toc } = await usePostContent(
    () => postIdx,
    () => post.value?.content,
  );
  const { activeId } = useActiveHeading(toc);

  // 진행 바는 헤더 독 안에서 그려진다. 여기서는 스크롤 추적만 켠다.
  useTrackReadingProgress();

  const series = computed(() => post.value?.series?.[0]);
  const category = computed(() => post.value?.categories?.[0]);
  const minutes = computed(() => readingMinutes(post.value?.content));
  const cclLicenseCode = computed(() => getCclLicenseCode(settings.value));

  const canonicalPath = computed(() =>
    post.value ? `/posts/${post.value.postIdx}-${post.value.slug}` : null,
  );
  const canonicalUrl = computed(() =>
    canonicalPath.value ? `${blogUrl.value}${canonicalPath.value}` : undefined,
  );

  // /posts/12 와 /posts/12-wrong-slug 를 정규 URL로 합쳐 중복 콘텐츠를 막음.
  // route.path는 상황에 따라 이중 인코딩되므로 경로 문자열 대신 디코딩한 라우트 param을 비교한다.
  const currentIdxParam = computed(() => decodeRouteSlug(String(route.params.idx ?? '')));
  const canonicalIdxParam = computed(() =>
    post.value ? `${post.value.postIdx}-${post.value.slug}` : null,
  );

  watch(
    canonicalIdxParam,
    (expected) => {
      if (!expected || currentIdxParam.value === expected) return;
      navigateTo(`/posts/${expected}`, { redirectCode: 301, replace: true });
    },
    { immediate: true },
  );

  useHead({
    link: () => (canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : []),
  });

  useSeoMeta({
    title: () => post.value?.title || 'Post',
    description: () => post.value?.summary || blogDescription.value,
    ogTitle: () => post.value?.title || 'Post',
    ogImage: () => post.value?.thumbnail || `${blogUrl.value}/images/croffle-logo.png`,
    ogDescription: () => post.value?.summary || blogDescription.value,
    ogUrl: canonicalUrl,
    ogType: 'article',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    articlePublishedTime: () => post.value?.publishedAt,
    articleModifiedTime: () => post.value?.updatedAt,
    articleSection: () => category.value?.name,
    articleTag: () => post.value?.tags?.map((tag) => tag.name),
  });

  useJsonLd(() => {
    if (!post.value || !canonicalUrl.value) return null;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.summary ?? undefined,
        image: post.value.thumbnail ?? undefined,
        datePublished: post.value.publishedAt,
        dateModified: post.value.updatedAt,
        mainEntityOfPage: canonicalUrl.value,
        wordCount: post.value.content?.length,
        keywords: post.value.tags?.map((tag) => tag.name).join(', '),
        author: {
          '@type': 'Person',
          name: authorDisplayName(post.value.author),
          url: post.value.author.nickname
            ? `${blogUrl.value}/authors/${encodeURIComponent(post.value.author.nickname)}`
            : undefined,
        },
        publisher: { '@type': 'Organization', name: siteName.value, url: blogUrl.value },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: blogUrl.value },
          { '@type': 'ListItem', position: 2, name: '전체 글', item: `${blogUrl.value}/posts` },
          { '@type': 'ListItem', position: 3, name: post.value.title, item: canonicalUrl.value },
        ],
      },
    ];
  });
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-5 sm:px-10">
    <div v-if="pending && !post" class="grid items-start gap-9 py-6 lg:grid-cols-[1fr_232px]">
      <div class="flex max-w-160 animate-pulse flex-col gap-5">
        <div class="skeleton h-4 w-40" />
        <div class="skeleton h-10 w-full" />
        <div class="skeleton h-10 w-3/4" />
        <div class="skeleton h-16 w-full" />
        <div class="skeleton h-57.5 w-full rounded-2xl" />
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-2/3" />
      </div>
      <div class="skeleton hidden h-64 rounded-2xl lg:block" />
    </div>

    <EmptyState
      v-else-if="!post"
      icon="lucide:alert-circle"
      tone="error"
      title="게시글을 찾을 수 없습니다."
    >
      <NuxtLink to="/posts" class="chip mt-2 rounded-full px-4 py-2.5 text-[12px]">
        전체 글 보기
      </NuxtLink>
    </EmptyState>

    <div v-else class="grid items-start gap-9 pt-4 pb-11.5 lg:grid-cols-[1fr_232px]">
      <article class="flex min-w-0 flex-col gap-5.5">
        <header class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center gap-2.25">
            <NuxtLink
              v-if="category"
              :to="{ name: 'categories-slug', params: { slug: category.slug } }"
              class="text-primary-soft rounded-md bg-[oklch(0.785_0.104_69.8/0.2)] px-2.25 py-1 font-mono text-[10.5px] font-medium tracking-[0.06em] uppercase"
            >
              {{ category.name }}
            </NuxtLink>
            <span class="text-fg-40 font-mono text-[11px] font-medium">
              <time :datetime="formatPostDateIso(post.publishedAt)">
                {{ formatPostDateYmd(post.publishedAt) }}
              </time>
              <template v-if="minutes"> · {{ minutes }}분 읽기</template>
            </span>
          </div>

          <h1
            class="font-display sm:text-article text-[25px] leading-[1.3] font-extrabold tracking-[-0.03em] text-pretty sm:tracking-[-0.035em]"
          >
            {{ post.title }}
          </h1>

          <p
            v-if="post.summary"
            class="text-fg-60 sm:text-lead text-[14px] leading-[1.75] text-pretty"
          >
            {{ post.summary }}
          </p>

          <AuthorByline :author="post.author" />
        </header>

        <div v-if="post.thumbnail" class="glass overflow-hidden rounded-2xl">
          <NuxtImg
            :src="post.thumbnail"
            :alt="post.title"
            width="1280"
            height="640"
            sizes="sm:100vw lg:640px"
            loading="eager"
            fetchpriority="high"
            preload
            class="h-60 w-full object-cover sm:h-120"
          />
        </div>

        <!-- 모바일 목차 -->
        <details v-if="toc.length" class="glass rounded-2xl p-4 lg:hidden">
          <summary
            class="flex cursor-pointer items-center justify-between text-[13px] font-semibold"
          >
            목차
            <Icon name="lucide:chevron-down" class="size-4" />
          </summary>
          <div class="mt-3.5">
            <TocLink :links="toc" :active-id="activeId" />
          </div>
        </details>

        <MarkdownContent :tree="tree ?? null" />

        <div v-if="post.tags?.length" class="flex flex-wrap gap-1.75 pt-1.5">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag.slug"
            :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
            class="chip rounded-lg px-2.75 py-1.5 text-[11.5px]"
          >
            #{{ tag.name }}
          </NuxtLink>
        </div>

        <SeriesBox v-if="series" :series="series" :current-post-idx="post.postIdx" />

        <PostNav :prev="post.prev" :next="post.next" />
      </article>

      <aside class="sticky top-21 hidden flex-col gap-3.5 lg:flex">
        <nav
          v-if="toc.length"
          class="glass flex flex-col gap-3 rounded-2xl p-4.5"
          aria-label="목차"
        >
          <span class="mono-label">ON THIS PAGE</span>
          <TocLink :links="toc" :active-id="activeId" />
        </nav>

        <div v-if="settings?.allowCCL" class="glass flex flex-col gap-2.5 rounded-2xl px-4.5 py-4">
          <span class="mono-label">LICENSE</span>
          <CclBadge />
          <NuxtLink
            to="/license"
            class="text-fg-50 hover:text-foreground text-[12px] leading-[1.6] transition-colors"
          >
            {{ cclLicenseCode }} · 출처를 남기면 자유롭게 인용할 수 있습니다.
          </NuxtLink>
        </div>
      </aside>
    </div>
  </div>
</template>
