<script setup lang="ts">
  defineProps<{
    columns?: string | number;
  }>();
</script>

<template>
  <div
    :class="
      cn(
        'my-8 grid grid-cols-1 gap-4',
        columns === '2' ? 'sm:grid-cols-2' : columns === '3' ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
      )
    "
  >
    <slot />
  </div>
</template>

<style scoped>
  :deep(figure) {
    margin-top: 0;
    margin-bottom: 0;
    height: 100%;
  }
  :deep(img) {
    height: 100%;
    object-fit: cover;
  }
</style>
