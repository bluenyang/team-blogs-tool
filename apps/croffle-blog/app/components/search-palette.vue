<script setup lang="ts">
  import { refDebounced } from '@vueuse/core';

  type PaletteRow =
    | {
        kind: 'post';
        key: string;
        title: string;
        meta: string;
        to: string;
        thumbnail: string | null;
      }
    | { kind: 'series'; key: string; title: string; meta: string; to: string }
    | { kind: 'tag'; key: string; title: string; meta: string; to: string };

  type FilterKind = 'all' | 'post' | 'series' | 'tag';

  const { isOpen, close } = useSearchPalette();
  const { sidebar } = useSidebar();
  // window keydown 핸들러에서는 Nuxt 컨텍스트가 없어 navigateTo가 실패한다.
  // setup에서 라우터를 잡아 두고 push로 이동한다.
  const router = useRouter();

  const query = ref('');
  const debouncedQuery = refDebounced(query, 300);
  const filter = ref<FilterKind>('all');
  const activeIndex = ref(0);
  const inputRef = ref<HTMLInputElement | null>(null);
  const listRef = ref<HTMLElement | null>(null);

  const { hits, pending, enabled } = usePostSearch(debouncedQuery);

  const term = computed(() => debouncedQuery.value.trim().toLowerCase());

  // 시리즈·태그는 이미 받아 둔 사이드바 payload에서 매칭한다 — 추가 요청 없음
  const seriesRows = computed<PaletteRow[]>(() => {
    if (!term.value) return [];
    return (sidebar.value?.series.items ?? [])
      .filter((item) => item.name.toLowerCase().includes(term.value))
      .slice(0, 4)
      .map((item) => ({
        kind: 'series' as const,
        key: `series-${item.slug}`,
        title: item.name,
        meta: `시리즈 · ${item.postCount ?? 0}편`,
        to: `/series/${encodeURIComponent(item.slug)}`,
      }));
  });

  const tagRows = computed<PaletteRow[]>(() => {
    if (!term.value) return [];
    return (sidebar.value?.tags.items ?? [])
      .filter((item) => item.name.toLowerCase().includes(term.value))
      .slice(0, 4)
      .map((item) => ({
        kind: 'tag' as const,
        key: `tag-${item.slug}`,
        title: `#${item.name}`,
        meta: `태그 · ${item.postCount ?? 0}편`,
        to: `/tags/${encodeURIComponent(item.slug)}`,
      }));
  });

  const postRows = computed<PaletteRow[]>(() =>
    hits.value.map((hit) => ({
      kind: 'post' as const,
      key: `post-${hit.postIdx}`,
      title: hit.title,
      meta: [hit.category, hit.authorNickname, formatPostDateYmd(hit.publishedAt)]
        .filter(Boolean)
        .join(' · '),
      to: `/posts/${hit.postIdx}-${hit.slug}`,
      thumbnail: hit.thumbnail,
    })),
  );

  const counts = computed(() => ({
    post: postRows.value.length,
    series: seriesRows.value.length,
    tag: tagRows.value.length,
    all: postRows.value.length + seriesRows.value.length + tagRows.value.length,
  }));

  const visiblePosts = computed(() =>
    filter.value === 'all' || filter.value === 'post' ? postRows.value : [],
  );
  const visibleSeries = computed(() =>
    filter.value === 'all' || filter.value === 'series' ? seriesRows.value : [],
  );
  const visibleTags = computed(() =>
    filter.value === 'all' || filter.value === 'tag' ? tagRows.value : [],
  );

  /** 키보드 이동은 섹션을 가로지르므로 평탄화한 순서를 따로 둔다. */
  const flatRows = computed(() => [
    ...visiblePosts.value,
    ...visibleSeries.value,
    ...visibleTags.value,
  ]);

  const FILTERS: { key: FilterKind; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'post', label: '글' },
    { key: 'series', label: '시리즈' },
    { key: 'tag', label: '태그' },
  ];

  watch([flatRows, () => filter.value], () => {
    activeIndex.value = 0;
  });

  watch(isOpen, async (open) => {
    if (open) {
      await nextTick();
      inputRef.value?.focus();
    } else {
      query.value = '';
      filter.value = 'all';
      activeIndex.value = 0;
    }
  });

  function move(delta: number) {
    const total = flatRows.value.length;
    if (!total) return;
    activeIndex.value = (activeIndex.value + delta + total) % total;
    nextTick(() => {
      listRef.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
    });
  }

  function openRow(row: PaletteRow | undefined, newTab = false) {
    if (!row) return;
    if (newTab) {
      window.open(row.to, '_blank', 'noopener');
      return;
    }
    close();
    router.push(row.to);
  }

  function onKeydown(event: KeyboardEvent) {
    const isPaletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

    if (isPaletteShortcut) {
      event.preventDefault();
      isOpen.value = !isOpen.value;
      return;
    }

    if (!isOpen.value) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Enter':
        event.preventDefault();
        openRow(flatRows.value[activeIndex.value], event.metaKey || event.ctrlKey);
        break;
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

  const isLocked = useScrollLock(import.meta.client ? document.body : null);
  watch(isOpen, (open) => {
    isLocked.value = open;
  });
  onUnmounted(() => {
    isLocked.value = false;
  });

  function rowIndex(row: PaletteRow) {
    return flatRows.value.findIndex((item) => item.key === row.key);
  }
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="animate-overlay-in fixed inset-0 z-80 flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="검색"
      @click.self="close()"
    >
      <div
        class="glass-palette flex max-h-[76vh] w-full max-w-218 flex-col overflow-hidden rounded-2xl"
      >
        <!-- 입력 -->
        <div
          class="border-border-strong flex items-center gap-3.5 border-b px-5 py-4 sm:px-6 sm:py-5"
        >
          <Icon name="lucide:search" class="text-fg-50 size-4.25 shrink-0" />
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="text-foreground placeholder:text-fg-40 min-w-0 flex-1 bg-transparent text-[17px] outline-none"
            placeholder="글 · 시리즈 · 태그 검색"
            aria-label="검색어"
            autocomplete="off"
            spellcheck="false"
          />
          <Icon v-if="pending" name="lucide:loader-2" class="text-fg-40 size-4 animate-spin" />
          <button
            type="button"
            class="bg-glass-2 text-fg-50 hover:text-foreground shrink-0 rounded-[7px] px-2.5 py-1.5 font-mono text-[11px] font-medium transition-colors"
            @click="close()"
          >
            ESC
          </button>
        </div>

        <!-- 타입 필터 -->
        <div class="border-border flex gap-2 overflow-x-auto border-b px-5 py-3.5 sm:px-6">
          <button
            v-for="item in FILTERS"
            :key="item.key"
            type="button"
            :class="
              cn(
                'chip shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11.5px]',
                filter === item.key && 'chip-active',
              )
            "
            :aria-pressed="filter === item.key"
            @click="filter = item.key"
          >
            {{ item.label }} {{ counts[item.key] }}
          </button>
        </div>

        <!-- 결과 -->
        <div ref="listRef" class="flex flex-1 flex-col gap-1 overflow-y-auto px-3.5 py-4 sm:px-3.5">
          <p v-if="!enabled" class="text-fg-40 px-3 py-10 text-center text-[13px]">
            두 글자 이상 입력하면 검색합니다.
          </p>
          <p
            v-else-if="!flatRows.length && !pending"
            class="text-fg-40 px-3 py-10 text-center text-[13px]"
          >
            "{{ debouncedQuery }}"에 대한 결과가 없습니다.
          </p>

          <template v-if="visiblePosts.length">
            <span class="mono-label px-3 py-1.5 text-[10.5px]">POSTS</span>
            <button
              v-for="row in visiblePosts"
              :key="row.key"
              type="button"
              :data-active="rowIndex(row) === activeIndex"
              :class="
                cn(
                  'flex w-full cursor-pointer items-center gap-3.5 rounded-lg border border-transparent px-3.5 py-3 text-left transition-colors',
                  rowIndex(row) === activeIndex
                    ? 'border-[oklch(0.785_0.104_69.8/0.3)] bg-[oklch(0.785_0.104_69.8/0.16)]'
                    : 'hover:bg-glass-2',
                )
              "
              @click="openRow(row)"
              @mouseenter="activeIndex = rowIndex(row)"
            >
              <NuxtImg
                v-if="row.kind === 'post' && row.thumbnail"
                :src="row.thumbnail"
                :alt="''"
                width="34"
                height="34"
                loading="lazy"
                class="border-border-strong size-8.5 shrink-0 rounded-md border object-cover"
              />
              <span
                v-else
                class="bg-glass-2 border-border-strong text-fg-40 grid size-8.5 shrink-0 place-items-center rounded-md border"
              >
                <Icon name="lucide:file-text" class="size-4" />
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-0.75">
                <span class="font-display truncate text-[14px] font-semibold">{{ row.title }}</span>
                <span class="text-fg-40 truncate text-[11.5px]">{{ row.meta }}</span>
              </span>
              <Icon name="lucide:corner-down-left" class="text-fg-35 size-3.5 shrink-0" />
            </button>
          </template>

          <template v-if="visibleSeries.length || visibleTags.length">
            <span class="mono-label px-3 pt-3.5 pb-1.5 text-[10.5px]">SERIES · TAGS</span>
            <button
              v-for="row in [...visibleSeries, ...visibleTags]"
              :key="row.key"
              type="button"
              :data-active="rowIndex(row) === activeIndex"
              :class="
                cn(
                  'flex w-full cursor-pointer items-center gap-3.5 rounded-lg border border-transparent px-3.5 py-3 text-left transition-colors',
                  rowIndex(row) === activeIndex
                    ? 'border-[oklch(0.785_0.104_69.8/0.3)] bg-[oklch(0.785_0.104_69.8/0.16)]'
                    : 'hover:bg-glass-2',
                )
              "
              @click="openRow(row)"
              @mouseenter="activeIndex = rowIndex(row)"
            >
              <span
                :class="
                  cn(
                    'grid size-8.5 shrink-0 place-items-center rounded-md border font-mono text-[13px] font-semibold',
                    row.kind === 'series'
                      ? 'text-primary-soft border-[oklch(0.785_0.104_69.8/0.3)] bg-[oklch(0.785_0.104_69.8/0.18)]'
                      : 'border-border-strong bg-glass-2 text-fg-50',
                  )
                "
              >
                {{ row.kind === 'series' ? 'S' : '#' }}
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-0.75">
                <span class="truncate text-[14px] font-semibold">{{ row.title }}</span>
                <span class="text-fg-40 truncate text-[11.5px]">{{ row.meta }}</span>
              </span>
            </button>
          </template>
        </div>

        <!-- 힌트 -->
        <div
          class="text-fg-40 border-border hidden items-center gap-4 border-t bg-black/20 px-6 py-3 font-mono text-[11px] font-medium sm:flex"
        >
          <span>↑↓ 이동</span>
          <span>↵ 열기</span>
          <span>⌘↵ 새 탭</span>
          <NuxtLink
            v-if="enabled"
            :to="{ path: '/search', query: { search: debouncedQuery } }"
            class="hover:text-foreground ml-auto transition-colors"
            @click="close()"
          >
            전체 결과 보기 →
          </NuxtLink>
        </div>
      </div>
    </div>
  </Teleport>
</template>
