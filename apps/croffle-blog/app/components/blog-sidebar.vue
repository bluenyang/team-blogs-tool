<script setup lang="ts">
  const { sidebar, pending } = useSidebar();
  const { description, links, wordmark } = useBlogBrand();
  const route = useRoute();

  const categories = computed(() => sidebar.value?.categories.items ?? []);
  const tags = computed(() => sidebar.value?.tags.items ?? []);
  const totalPosts = computed(() => sidebar.value?.profile.totalPosts ?? 0);

  const isAllActive = computed(() => route.path === '/posts');
</script>

<template>
  <aside class="flex flex-col gap-4" aria-label="블로그 탐색">
    <!-- 프로필 -->
    <div
      class="glass-strong flex flex-col items-center gap-2.75 rounded-xl px-5 py-5.5 text-center"
    >
      <BrandMark :size="76" />
      <NuxtLink to="/" class="font-display text-[16px] font-extrabold tracking-[-0.02em]">
        {{ wordmark.lead }}
        <span class="text-primary">{{ wordmark.accent }}</span>
      </NuxtLink>
      <p class="text-fg-50 text-[12px] leading-[1.65]">{{ description }}</p>
      <div class="mt-0.5 flex flex-wrap justify-center gap-1.75">
        <a
          v-for="link in links"
          :key="link.name"
          :href="link.url"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          :aria-label="link.label"
          :title="link.label"
          class="border-border-strong bg-glass-3 text-fg-50 hover:text-foreground grid size-11 place-items-center rounded-[9px] border transition-colors sm:size-7"
        >
          <Icon :name="link.icon" class="size-3.75" />
        </a>
      </div>
    </div>

    <!-- 카테고리 -->
    <div class="glass flex flex-col gap-3 rounded-xl px-5 py-4.5">
      <span class="mono-label">CATEGORIES</span>

      <div v-if="pending && !categories.length" class="flex flex-col gap-2">
        <div v-for="i in 5" :key="i" class="skeleton h-5 w-full" />
      </div>

      <template v-else>
        <NuxtLink
          to="/posts"
          :aria-current="isAllActive ? 'page' : undefined"
          :class="
            cn(
              'flex items-center justify-between gap-2 rounded-lg py-1.5 pr-2 pl-2 text-[13px] transition-colors',
              isAllActive ? 'text-primary font-semibold' : 'text-fg-80 hover:text-foreground',
            )
          "
        >
          <span>전체 글</span>
          <span class="text-fg-35 font-mono text-[11px] font-medium">{{ totalPosts }}</span>
        </NuxtLink>

        <SidebarCategoryTree v-if="categories.length" :items="categories" />
      </template>
    </div>

    <!-- 태그 -->
    <div v-if="tags.length || pending" class="glass flex flex-col gap-2.75 rounded-xl px-5 py-4.5">
      <div class="flex items-baseline justify-between">
        <span class="mono-label">TAGS</span>
        <NuxtLink to="/tags" class="text-primary text-[11px] font-semibold">전체 →</NuxtLink>
      </div>
      <div v-if="pending && !tags.length" class="flex flex-wrap gap-1.5">
        <div v-for="i in 8" :key="i" class="skeleton h-6 w-16" />
      </div>
      <div v-else class="flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in tags.slice(0, 24)"
          :key="tag.slug"
          :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
          class="chip rounded-[7px] px-2.25 py-1.25 text-[11px]"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
