<script setup lang="ts">
  const {
    src = null,
    name = '',
    size = 34,
    ring = false,
  } = defineProps<{
    src?: string | null;
    name?: string | null;
    size?: number;
    /** 아바타 스택에서 배경색 테두리로 겹침을 표현할 때 */
    ring?: boolean;
  }>();

  const initial = computed(() => (name || '?').trim().charAt(0).toUpperCase());
  const style = computed(() => ({ width: `${size}px`, height: `${size}px` }));
</script>

<template>
  <NuxtImg
    v-if="src"
    :src="src"
    :alt="name || '작성자'"
    :width="size"
    :height="size"
    :style="style"
    loading="lazy"
    :class="
      cn(
        'border-border-hover shrink-0 rounded-full border object-cover',
        ring && 'border-surface border-2',
      )
    "
  />
  <span
    v-else
    :style="style"
    :aria-label="name || '작성자'"
    :class="
      cn(
        'bg-glass-3 text-fg-50 font-display border-border-hover grid shrink-0 place-items-center rounded-full border font-bold',
        ring && 'border-surface border-2',
      )
    "
  >
    <span :style="{ fontSize: `${Math.max(10, Math.round(size * 0.4))}px` }">{{ initial }}</span>
  </span>
</template>
