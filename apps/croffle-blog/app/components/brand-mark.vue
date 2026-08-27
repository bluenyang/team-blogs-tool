<script setup lang="ts">
  const { size = 32, priority = false } = defineProps<{
    size?: number;
    priority?: boolean;
  }>();

  /**
   * 192px로 미리 리사이즈한 정적 자산(14KB). 원본 `croffle-logo.png`(1500×1500, 895KB)은
   * ipx/sharp로 그때그때 줄여 왔는데, sharp는 네이티브 바이너리라 Cloudflare Workers 같은
   * V8 isolate 런타임에서 돌지 않는다. 빌드 타깃과 무관하게 항상 같은 자산을 쓰도록
   * 이 파일 하나는 미리 만들어 두고 `<NuxtImg provider="none">`로 그대로 서빙한다.
   * 현재 최대 렌더 크기(76px)의 2배 이상을 커버한다 — 더 큰 곳에서 쓰면 다시 생성할 것.
   */
  const src = '/images/croffle-logo-mark.webp';
</script>

<template>
  <NuxtImg
    :src="src"
    provider="none"
    alt="Croffle Dev."
    :width="size"
    :height="size"
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="block shrink-0 rounded-full"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    :preload="priority"
  />
</template>
