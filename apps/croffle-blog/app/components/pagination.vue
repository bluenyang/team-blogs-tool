<script setup lang="ts">
  const props = defineProps<{
    total?: number;
    current: number;
    limit: number;
  }>();

  const emit = defineEmits<{
    'update:current': [page: number];
  }>();

  const totalPages = computed(() => {
    if (!props.total || props.total <= 0 || props.limit <= 0) {
      return 0;
    }
    return Math.ceil(props.total / props.limit);
  });

  const visible = computed(() => totalPages.value > 1);

  const pages = computed(() => {
    const total = totalPages.value;
    const current = props.current;
    const siblings = 1;
    const range: Array<number | 'ellipsis'> = [];

    if (total <= 7) {
      for (let page = 1; page <= total; page += 1) {
        range.push(page);
      }
      return range;
    }

    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);

    range.push(1);
    if (left > 2) {
      range.push('ellipsis');
    }
    for (let page = left; page <= right; page += 1) {
      range.push(page);
    }
    if (right < total - 1) {
      range.push('ellipsis');
    }
    range.push(total);

    return range;
  });

  function goTo(page: number) {
    if (page < 1 || page > totalPages.value || page === props.current) {
      return;
    }
    emit('update:current', page);
  }
</script>

<template>
  <nav
    v-if="visible"
    class="mt-3 flex items-center justify-center gap-1.75"
    aria-label="페이지네이션"
  >
    <button
      type="button"
      class="chip grid size-11 cursor-pointer place-items-center rounded-md text-[12.5px] disabled:pointer-events-none disabled:opacity-40 sm:size-8.5"
      :disabled="current <= 1"
      aria-label="이전 페이지"
      @click="goTo(current - 1)"
    >
      <Icon name="lucide:chevron-left" class="size-4" />
    </button>

    <template v-for="(page, index) in pages" :key="`${page}-${index}`">
      <span v-if="page === 'ellipsis'" class="text-fg-40 px-1 text-sm" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        :aria-label="`${page} 페이지`"
        :aria-current="page === current ? 'page' : undefined"
        :class="
          cn(
            'chip grid size-11 cursor-pointer place-items-center rounded-md text-[12.5px] font-semibold sm:size-8.5',
            page === current && 'chip-active',
          )
        "
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      class="chip grid size-11 cursor-pointer place-items-center rounded-md text-[12.5px] disabled:pointer-events-none disabled:opacity-40 sm:size-8.5"
      :disabled="current >= totalPages"
      aria-label="다음 페이지"
      @click="goTo(current + 1)"
    >
      <Icon name="lucide:chevron-right" class="size-4" />
    </button>
  </nav>
</template>
