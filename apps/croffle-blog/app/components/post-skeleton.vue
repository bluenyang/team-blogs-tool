<script setup lang="ts">
  const { variant = 'card', count = 3 } = defineProps<{
    variant?: 'card' | 'row' | 'featured';
    count?: number;
  }>();
</script>

<template>
  <!-- 스피너 대신 실제 카드와 같은 골격을 그려 레이아웃 시프트를 없앤다 -->
  <template v-if="variant === 'featured'">
    <div
      class="glass-strong grid animate-pulse overflow-hidden rounded-[20px] lg:grid-cols-[1.08fr_0.92fr]"
    >
      <div class="flex flex-col gap-4 px-8 py-7.5">
        <div class="skeleton h-5 w-28" />
        <div class="skeleton h-8 w-full" />
        <div class="skeleton h-8 w-4/5" />
        <div class="skeleton h-4 w-full" />
        <div class="skeleton mt-auto h-9 w-40" />
      </div>
      <div class="skeleton min-h-45 rounded-none lg:min-h-72.5" />
    </div>
  </template>

  <template v-else-if="variant === 'row'">
    <div
      v-for="i in count"
      :key="i"
      class="glass grid animate-pulse gap-5 rounded-xl p-5 sm:grid-cols-[1fr_168px]"
    >
      <div class="flex flex-col gap-2.5">
        <div class="skeleton h-3 w-32" />
        <div class="skeleton h-6 w-4/5" />
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-2/3" />
      </div>
      <div class="skeleton hidden h-27.5 sm:block" />
    </div>
  </template>

  <template v-else>
    <div
      v-for="i in count"
      :key="i"
      class="glass flex animate-pulse flex-col overflow-hidden rounded-2xl"
    >
      <div class="skeleton h-28 rounded-none" />
      <div class="flex flex-col gap-2.5 px-4.5 pt-4.25 pb-4.5">
        <div class="skeleton h-3 w-20" />
        <div class="skeleton h-5 w-full" />
        <div class="skeleton h-4 w-4/5" />
        <div class="skeleton mt-3 h-6 w-32" />
      </div>
    </div>
  </template>
</template>
