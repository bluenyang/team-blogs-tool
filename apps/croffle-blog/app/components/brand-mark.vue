<script setup lang="ts">
  const { size = 32, priority = false } = defineProps<{
    size?: number;
    priority?: boolean;
  }>();
</script>

<template>
  <NuxtImg
    :src="BRAND_LOGO"
    alt="Croffle Dev."
    :width="size"
    :height="size"
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="block shrink-0 rounded-full"
    format="webp"
    quality="85"
    :densities="'x1 x2'"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    :preload="priority"
  />
</template>
