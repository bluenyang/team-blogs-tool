<script setup lang="ts">
  const route = useRoute();
  const router = useRouter();
  const { siteName, blogUrl } = useBlogBrand();

  const nick = computed(() => decodeRouteSlug(String(route.params.nick || '')));

  const limit = 10;
  const currentPage = computed({
    get: () => Math.max(Number(route.query.page) || 1, 1),
    set: (page: number) => {
      router.push({ query: { ...route.query, page: page > 1 ? String(page) : undefined } });
    },
  });

  const { author, posts, totalCount, topics, seriesCount, others, pending, error } =
    await useAuthorProfile(nick, limit, currentPage);

  if (error.value?.statusCode === 404) {
    throw createError({ statusCode: 404, statusMessage: 'Author not found', fatal: true });
  }

  const role = computed(() => roleLabel(author.value?.role));
  const maxTopic = computed(() => Math.max(...topics.value.map((t) => t.count), 1));
  const totalPages = computed(() => Math.max(Math.ceil(totalCount.value / limit), 1));

  const canonicalUrl = computed(
    () => `${blogUrl.value}/authors/${encodeURIComponent(author.value?.slug ?? nick.value)}`,
  );

  const pageTitle = computed(() => `${author.value?.nickname ?? nick.value}의 글`);
  const pageDesc = computed(
    () =>
      author.value?.bio ||
      `${author.value?.nickname ?? nick.value}이(가) ${siteName.value}에 쓴 글 ${totalCount.value}편.`,
  );

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
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogImage: () => author.value?.avatar || `${blogUrl.value}/images/croffle-logo.png`,
    ogUrl: canonicalUrl,
    ogType: 'profile',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    robots: () => (currentPage.value > 1 ? 'noindex, follow' : undefined),
  });

  useJsonLd(() => {
    if (!author.value) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: author.value.nickname,
        alternateName: author.value.name ?? undefined,
        description: author.value.bio ?? undefined,
        image: author.value.avatar ?? undefined,
        url: canonicalUrl.value,
        sameAs: author.value.links.filter((l) => l.name !== 'mail').map((l) => l.url),
      },
      hasPart: posts.value.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${blogUrl.value}${postPath(post)}`,
        datePublished: post.publishedAt,
      })),
    };
  });
</script>

<template>
  <div class="mx-auto w-full max-w-275 px-5 pt-4 pb-11.5 sm:px-10">
    <!-- 프로필 카드 -->
    <div v-if="pending && !author" class="glass-strong flex animate-pulse gap-6 rounded-2xl p-7">
      <div class="skeleton size-26 shrink-0 rounded-full" />
      <div class="flex flex-1 flex-col gap-3">
        <div class="skeleton h-8 w-48" />
        <div class="skeleton h-4 w-full max-w-105" />
        <div class="skeleton h-7 w-56" />
      </div>
    </div>

    <EmptyState
      v-else-if="error || !author"
      icon="lucide:user-x"
      tone="error"
      title="필진을 찾을 수 없습니다."
    >
      <NuxtLink to="/authors" class="chip mt-2 rounded-full px-4 py-2.5 text-[12px]">
        필진 전체 보기
      </NuxtLink>
    </EmptyState>

    <template v-else>
      <header
        class="glass-strong flex flex-col items-center gap-6 rounded-2xl px-6 py-7 text-center sm:px-7.5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:text-left"
      >
        <AuthorAvatar :src="author.avatar" :name="author.nickname" :size="104" />

        <div class="flex flex-col items-center gap-2.25 lg:items-start">
          <div class="flex flex-wrap items-baseline justify-center gap-2.75 lg:justify-start">
            <h1 class="font-display text-[27px] font-extrabold tracking-[-0.03em]">
              {{ author.nickname }}
            </h1>
            <span v-if="author.name" class="text-fg-50 text-[14px]">{{ author.name }}</span>
            <span
              v-if="role"
              class="text-primary-soft rounded-md bg-[oklch(0.785_0.104_69.8/0.2)] px-2.25 py-1 font-mono text-[10.5px] font-medium"
            >
              {{ role }}
            </span>
          </div>

          <p v-if="author.bio" class="text-fg-60 text-body max-w-130 text-pretty">
            {{ author.bio }}
          </p>

          <div
            v-if="author.links.length"
            class="mt-0.5 flex flex-wrap justify-center gap-1.75 lg:justify-start"
          >
            <a
              v-for="link in author.links"
              :key="link.name"
              :href="link.url"
              :target="link.url.startsWith('mailto:') ? undefined : '_blank'"
              rel="noopener noreferrer me"
              class="chip flex min-h-11 items-center gap-1.5 rounded-lg px-2.75 text-[11px] sm:min-h-0 sm:py-1.5"
            >
              <Icon :name="link.icon" class="size-3.25" />
              {{ link.label }}
            </a>
          </div>
        </div>

        <div class="flex gap-3">
          <div
            class="border-border bg-glass-2 flex min-w-22 flex-col items-center gap-1 rounded-lg border px-5 py-4"
          >
            <span class="font-display text-[26px] leading-none font-extrabold tracking-[-0.03em]">
              {{ totalCount }}
            </span>
            <span class="text-fg-40 text-[11px]">글</span>
          </div>
          <div
            class="border-border bg-glass-2 flex min-w-22 flex-col items-center gap-1 rounded-lg border px-5 py-4"
          >
            <span class="font-display text-[26px] leading-none font-extrabold tracking-[-0.03em]">
              {{ seriesCount }}
            </span>
            <span class="text-fg-40 text-[11px]">시리즈</span>
          </div>
        </div>
      </header>

      <div class="grid items-start gap-6.5 pt-8 lg:grid-cols-[1fr_300px]">
        <!-- 글 목록 -->
        <section class="flex min-w-0 flex-col gap-3.5">
          <div class="flex items-center gap-2.25">
            <h2 class="font-display text-[17px] font-bold tracking-[-0.02em]">
              {{ author.nickname }}의 글
            </h2>
            <span class="text-fg-40 font-mono text-[11.5px] font-medium">{{ totalCount }}편</span>
          </div>

          <EmptyState
            v-if="!posts.length"
            icon="lucide:file-text"
            title="아직 발행한 글이 없습니다."
          />

          <template v-else>
            <NuxtLink
              v-for="post in posts"
              :key="post.postIdx"
              :to="postPath(post)"
              class="glass glass-interactive flex flex-col gap-3 rounded-2xl px-5 py-4.25 sm:flex-row sm:items-center sm:gap-4.5"
            >
              <time
                :datetime="formatPostDateIso(post.publishedAt)"
                class="text-fg-35 shrink-0 font-mono text-[11px] font-medium sm:w-18.5"
              >
                {{ formatPostDateYmd(post.publishedAt) }}
              </time>
              <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                <span class="font-display text-[15px] leading-[1.4] font-semibold">
                  {{ post.title }}
                </span>
                <span v-if="post.summary" class="text-fg-40 line-clamp-1 text-[12px]">
                  {{ post.summary }}
                </span>
              </div>
              <span
                v-if="primaryCategory(post)"
                class="bg-glass-2 text-fg-50 shrink-0 self-start rounded-md px-2.25 py-1.5 font-mono text-[10.5px] font-medium sm:self-auto"
              >
                {{ primaryCategory(post) }}
              </span>
            </NuxtLink>

            <Pagination v-model:current="currentPage" :total="totalCount" :limit="limit" />
          </template>
        </section>

        <!-- 사이드바 -->
        <aside class="flex flex-col gap-4">
          <div v-if="topics.length" class="glass flex flex-col gap-3.5 rounded-xl p-5">
            <span class="mono-label">주로 쓰는 주제</span>
            <div
              v-for="topic in topics.slice(0, 5)"
              :key="topic.slug"
              class="flex flex-col gap-1.5"
            >
              <div class="text-fg-80 flex justify-between text-[12.5px]">
                <NuxtLink
                  :to="{ name: 'categories-slug', params: { slug: topic.slug } }"
                  class="hover:text-foreground truncate transition-colors"
                >
                  {{ topic.name }}
                </NuxtLink>
                <span class="text-fg-40 shrink-0 font-mono text-[11px] font-medium">
                  {{ topic.count }}
                </span>
              </div>
              <div class="h-1.25 overflow-hidden rounded-[3px] bg-white/[0.07]">
                <div
                  class="bg-primary h-full rounded-[3px]"
                  :style="{ width: `${Math.round((topic.count / maxTopic) * 100)}%` }"
                />
              </div>
            </div>
          </div>

          <div v-if="others.length" class="glass flex flex-col gap-3 rounded-xl p-5">
            <span class="mono-label">다른 필진</span>
            <NuxtLink
              v-for="other in others"
              :key="other.id"
              :to="`/authors/${encodeURIComponent(other.slug)}`"
              class="hover:bg-glass-2 -mx-2 flex items-center gap-2.75 rounded-lg px-2 py-1.5 transition-colors"
            >
              <AuthorAvatar :src="other.avatar" :name="other.nickname" :size="30" />
              <div class="flex min-w-0 flex-1 flex-col">
                <span class="font-display truncate text-[12.5px] font-semibold">
                  {{ other.nickname }}
                </span>
                <span v-if="other.name" class="text-fg-40 truncate text-[11px]">
                  {{ other.name }}
                </span>
              </div>
              <span class="text-fg-40 shrink-0 font-mono text-[11px] font-medium">
                {{ other.postCount }}
              </span>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
