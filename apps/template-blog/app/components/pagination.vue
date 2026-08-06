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
    class="mt-12 flex items-center justify-center gap-1"
    aria-label="페이지네이션"
  >
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40"
      :disabled="current <= 1"
      aria-label="이전 페이지"
      @click="goTo(current - 1)"
    >
      <Icon name="lucide:chevron-left" class="size-4" />
    </button>

    <template v-for="(page, index) in pages" :key="`${page}-${index}`">
      <span
        v-if="page === 'ellipsis'"
        class="text-muted-foreground px-1 text-sm"
        aria-hidden="true"
      >
        …
      </span>
      <button
        v-else
        type="button"
        :aria-label="`${page} 페이지`"
        :aria-current="page === current ? 'page' : undefined"
        :class="
          cn(
            'inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
            page === current
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )
        "
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      class="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40"
      :disabled="current >= totalPages"
      aria-label="다음 페이지"
      @click="goTo(current + 1)"
    >
      <Icon name="lucide:chevron-right" class="size-4" />
    </button>
  </nav>
</template>
