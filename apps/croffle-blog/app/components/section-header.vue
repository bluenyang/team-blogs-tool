<script setup lang="ts">
  const {
    title,
    moreTo = '',
    moreLabel = '전체 보기',
  } = defineProps<{
    title: string;
    moreTo?: string;
    moreLabel?: string;
  }>();
</script>

<template>
  <div class="flex items-baseline justify-between gap-4">
    <h2 class="font-display text-row-title font-bold tracking-[-0.02em]">{{ title }}</h2>
    <NuxtLink
      v-if="moreTo"
      :to="moreTo"
      class="text-primary shrink-0 text-[12.5px] font-semibold transition-opacity hover:opacity-80"
    >
      {{ moreLabel }} →
    </NuxtLink>
  </div>
</template>
