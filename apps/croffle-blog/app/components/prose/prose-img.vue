<script setup lang="ts">
  import { ref } from 'vue';

  defineProps<{
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }>();

  // 이미지 로딩 상태 관리 (스켈레톤 또는 페이드인 효과를 위함)
  const isLoaded = ref(false);
  const hasError = ref(false);

  const onLoad = () => {
    isLoaded.value = true;
  };

  const onError = () => {
    hasError.value = true;
  };
</script>

<template>
  <figure class="my-8 flex flex-col items-center justify-center">
    <!-- 이미지 래퍼: 이미지가 로드되기 전의 배경색과 테두리 정의 -->
    <div
      class="bg-muted border-border relative flex justify-center overflow-hidden rounded-sm border shadow-sm transition-all duration-300"
    >
      <!-- 이미지 로딩 실패 시 폴백(Fallback) UI -->
      <div
        v-if="hasError"
        class="text-muted-foreground flex flex-col items-center justify-center p-12"
      >
        <Icon name="lucide:image-off" class="mb-2 size-8 opacity-50" />
        <span class="text-sm">이미지를 불러올 수 없습니다</span>
      </div>

      <!-- 실제 이미지 -->
      <img
        v-else
        :src="src"
        :alt="alt || '게시글 이미지'"
        :width="width"
        :height="height"
        loading="lazy"
        decoding="async"
        class="h-auto max-w-full object-contain transition-opacity duration-500 ease-in-out"
        :class="{
          'opacity-0': !isLoaded, // 로드 전에는 투명하게
          'opacity-100': isLoaded, // 로드 완료 후 페이드 인
        }"
        @load="onLoad"
        @error="onError"
      />
    </div>

    <!-- 이미지 캡션 (alt 속성을 캡션으로 활용) -->
    <figcaption v-if="alt && !hasError" class="text-muted-foreground mt-3 text-center text-sm">
      {{ alt }}
    </figcaption>
  </figure>
</template>
