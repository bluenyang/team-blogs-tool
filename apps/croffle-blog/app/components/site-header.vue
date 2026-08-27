<script setup lang="ts">
  import { PRIMARY_NAV, isNavActive } from '~/constants/navigation';

  const route = useRoute();
  const { wordmark } = useBlogBrand();
  const { open: openSearch } = useSearchPalette();
  const { isOpen: isDrawerOpen, toggle: toggleDrawer } = useSidebar();

  // 스크롤에 따라 독 배경만 진해진다. dock 자체는 항상 떠 있는 형태(시안 기준).
  const { y } = useWindowScroll();
  const isScrolled = computed(() => y.value > 12);

  const isMac = ref(false);
  onMounted(() => {
    isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  });
  const searchHint = computed(() => (isMac.value ? '⌘K' : 'Ctrl K'));
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 px-3.5 pt-2 sm:px-5 sm:pt-3.5">
    <div
      :class="
        cn(
          'glass-dock mx-auto flex h-14 max-w-7xl items-center justify-between gap-5 rounded-[20px] px-4 transition-[background-color,box-shadow] duration-500 sm:rounded-3xl sm:px-5.5',
          isScrolled && 'bg-glass-3 shadow-card',
        )
      "
    >
      <!-- 좌: 로고 + 워드마크 -->
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-full" aria-label="홈으로">
        <BrandMark :size="30" priority class="sm:hidden" />
        <BrandMark :size="32" priority class="hidden sm:block" />
        <span
          class="font-display text-[15px] font-extrabold tracking-[-0.02em] whitespace-nowrap sm:text-[17px]"
        >
          {{ wordmark.lead }}
          <span class="text-primary">{{ wordmark.accent }}</span>
        </span>
        <span
          class="text-primary-soft hidden rounded-[7px] bg-[oklch(0.785_0.104_69.8/0.18)] px-2 py-1 font-mono text-[10.5px] font-semibold tracking-[0.08em] lg:inline"
        >
          BLOG
        </span>
      </NuxtLink>

      <!-- 중앙: 1차 nav (데스크톱) -->
      <nav class="hidden items-center gap-5.5 text-[13.5px] md:flex" aria-label="주요 메뉴">
        <NuxtLink
          v-for="item in PRIMARY_NAV"
          :key="item.to"
          :to="item.to"
          :class="
            cn(
              'hover:text-foreground transition-colors',
              isNavActive(item, route.path) ? 'text-foreground font-semibold' : 'text-fg-60',
            )
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 우: 검색 + 모바일 메뉴 -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="text-fg-40 hover:text-fg-60 border-border-strong bg-glass-2 hidden min-w-35 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] transition-colors lg:flex"
          aria-label="검색 열기"
          @click="openSearch()"
        >
          <Icon name="lucide:search" class="size-3.25" />
          <span>검색</span>
          <span class="ml-auto font-mono text-[10px] font-medium">{{ searchHint }}</span>
        </button>

        <button
          type="button"
          class="text-fg-60 hover:text-foreground grid size-11 cursor-pointer place-items-center rounded-full transition-colors lg:hidden"
          aria-label="검색 열기"
          @click="openSearch()"
        >
          <span
            class="border-border-strong bg-glass-2 grid size-8.5 place-items-center rounded-full border"
          >
            <Icon name="lucide:search" class="size-3.75" />
          </span>
        </button>

        <button
          type="button"
          class="text-fg-60 hover:text-foreground grid size-11 cursor-pointer place-items-center rounded-full transition-colors md:hidden"
          :aria-expanded="isDrawerOpen"
          aria-label="카테고리 메뉴 열기"
          @click="toggleDrawer()"
        >
          <span
            class="border-border-strong bg-glass-2 grid size-8.5 place-items-center rounded-full border"
          >
            <Icon name="lucide:menu" class="size-3.75" />
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
