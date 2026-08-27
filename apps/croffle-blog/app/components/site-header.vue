<script setup lang="ts">
  import { TransitionPresets } from '@vueuse/core';

  import { PRIMARY_NAV, isNavActive } from '~/constants/navigation';

  const route = useRoute();
  const { wordmark } = useBlogBrand();
  const { open: openSearch } = useSearchPalette();
  const { isOpen: isDrawerOpen, toggle: toggleDrawer } = useSidebar();

  const { y } = useWindowScroll();

  // 서버와 첫 클라이언트 렌더는 항상 최상단(0) 상태로 맞춘다.
  // useWindowScroll은 클라이언트에서 즉시 실제 스크롤을 읽으므로, 스크롤이 복원된 채 들어오면
  // 이 가드가 없을 때 서버 마크업과 어긋난다.
  const isMounted = ref(false);
  onMounted(() => {
    isMounted.value = true;
  });

  // 스크롤 0~160px 구간에서 꽉 찬 바 → 떠 있는 독으로 좁혀진다
  const rawProgress = computed(() => {
    if (!isMounted.value) return 0;
    return Math.max(0, Math.min(1, y.value / 160));
  });

  const smoothProgress = useTransition(rawProgress, {
    duration: 400,
    transition: TransitionPresets.easeOutCubic,
  });

  // 모션을 줄이도록 설정한 사용자에게는 보간 없이 스크롤을 그대로 따라가게 한다
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dockProgress = computed(() =>
    reduceMotion.value ? rawProgress.value : smoothProgress.value,
  );

  const isDocked = computed(() => dockProgress.value > 0.3);

  // 글 상세에서만 켜진다 (useTrackReadingProgress)
  const { progress: readingProgress, isActive: isReading } = useReadingProgress();

  const isMac = ref(false);
  onMounted(() => {
    isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

    console.log(wordmark.value);
  });
  const searchHint = computed(() => (isMac.value ? '⌘K' : 'Ctrl K'));
</script>

<template>
  <!-- 독 바깥 영역은 클릭을 막지 않도록 헤더 자체는 pointer-events를 흘려보낸다 -->
  <header class="pointer-events-none fixed inset-x-0 top-0 z-50 h-19">
    <div
      class="site-dock pointer-events-auto flex items-center"
      :style="{ '--dock-p': dockProgress }"
      :data-docked="isDocked"
    >
      <!-- 바 자체는 최상단에서 화면 끝까지 가지만, 내용물은 본문과 같은 폭으로 묶는다 -->
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-5.5">
        <!-- 좌: 로고 + 워드마크 -->
        <NuxtLink to="/" class="flex items-center gap-2.5 rounded-full" aria-label="홈으로">
          <BrandMark :size="30" priority class="sm:hidden" />
          <BrandMark :size="32" priority class="hidden sm:block" />
          <span
            class="font-display text-[15px] font-extrabold tracking-[-0.02em] whitespace-nowrap sm:text-[17px]"
          >
            {{ wordmark.lead }}
            <span class="text-primary">{{ `${wordmark.accent}` }}</span>
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

      <!-- 읽기 진행 바 — 독의 자식이라 헤더가 좁아지면 같이 좁아진다 -->
      <div
        v-if="isReading"
        class="dock-progress"
        role="progressbar"
        aria-label="읽기 진행률"
        :aria-valuenow="Math.round(readingProgress * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span :style="{ transform: `scaleX(${readingProgress})` }" />
      </div>
    </div>
  </header>
</template>
