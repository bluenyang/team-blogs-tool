<script setup lang="ts">
  import type { MarkdownDocument as MarkdownDocumentType } from 'comark';

  defineProps<{ tree: MarkdownDocumentType | null }>();
</script>

<template>
  <!-- prose/* 컴포넌트는 @comark/nuxt가 components/prose를 스캔해 자동 매핑한다 -->
  <div class="prose-root text-fg-80 sm:text-lead text-[14.5px] leading-[1.9]">
    <MarkdownDocument v-if="tree" :value="tree" />
  </div>
</template>
