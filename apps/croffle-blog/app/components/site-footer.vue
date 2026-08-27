<script setup lang="ts">
  const { description, links, wordmark } = useBlogBrand();
  const { sidebar } = useSidebar();

  const categories = computed(() => sidebar.value?.categories.items.slice(0, 4) ?? []);
  const series = computed(() => sidebar.value?.series.items.slice(0, 4) ?? []);
  const currentYear = new Date().getUTCFullYear();
</script>

<template>
  <footer class="mx-auto w-full max-w-7xl px-5 pb-9 sm:px-10">
    <div class="glass flex flex-col gap-5.5 rounded-[20px] px-6 pt-7 pb-5.5 sm:px-7.5">
      <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div class="flex flex-col gap-2.75">
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <BrandMark :size="30" />
            <span class="font-display text-[15.5px] font-extrabold tracking-[-0.02em]">
              {{ wordmark.lead }}
              <span class="text-primary">{{ wordmark.accent }}</span>
            </span>
          </NuxtLink>
          <p class="text-fg-50 max-w-75 text-[12.5px] leading-[1.7]">{{ description }}</p>
          <div class="mt-0.5 flex flex-wrap gap-1.75">
            <a
              v-for="link in links"
              :key="link.name"
              :href="link.url"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              class="chip flex min-h-11 items-center gap-1.5 rounded-lg px-2.75 text-[11px] sm:min-h-0 sm:py-1.5"
            >
              <Icon :name="link.icon" class="size-3.25" />
              {{ link.label }}
            </a>
          </div>
        </div>

        <nav class="flex flex-col gap-2.5" aria-label="블로그 메뉴">
          <span class="mono-label text-[10.5px]">BLOG</span>
          <NuxtLink
            to="/posts"
            class="text-fg-60 hover:text-foreground text-[12.5px] transition-colors"
          >
            전체 글
          </NuxtLink>
          <NuxtLink
            to="/series"
            class="text-fg-60 hover:text-foreground text-[12.5px] transition-colors"
          >
            시리즈
          </NuxtLink>
          <NuxtLink
            to="/tags"
            class="text-fg-60 hover:text-foreground text-[12.5px] transition-colors"
          >
            태그
          </NuxtLink>
          <NuxtLink
            to="/authors"
            class="text-fg-60 hover:text-foreground text-[12.5px] transition-colors"
          >
            필진
          </NuxtLink>
        </nav>

        <nav v-if="categories.length" class="flex flex-col gap-2.5" aria-label="카테고리">
          <span class="mono-label text-[10.5px]">CATEGORIES</span>
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="{ name: 'categories-slug', params: { slug: category.slug } }"
            class="text-fg-60 hover:text-foreground truncate text-[12.5px] transition-colors"
          >
            {{ category.name }}
          </NuxtLink>
        </nav>

        <nav v-if="series.length" class="flex flex-col gap-2.5" aria-label="시리즈">
          <span class="mono-label text-[10.5px]">SERIES</span>
          <NuxtLink
            v-for="item in series"
            :key="item.slug"
            :to="{ name: 'series-slug', params: { slug: item.slug } }"
            class="text-fg-60 hover:text-foreground truncate text-[12.5px] transition-colors"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>

      <div class="bg-border h-px" />

      <div
        class="text-fg-35 flex flex-col gap-3 font-mono text-[11px] font-medium sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© {{ currentYear }} {{ wordmark.lead }} {{ wordmark.accent }}</span>
        <span class="flex gap-4">
          <NuxtLink to="/license" class="hover:text-foreground transition-colors">License</NuxtLink>
          <a href="/rss.xml" class="hover:text-foreground transition-colors">RSS</a>
          <a href="/sitemap.xml" class="hover:text-foreground transition-colors">Sitemap</a>
        </span>
      </div>
    </div>
  </footer>
</template>
