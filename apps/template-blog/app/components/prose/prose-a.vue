<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    href: string; // 링크 URL
    target?: string; // 새 창 열기 여부 (ex: _blank)
    rel?: string; // SEO 및 보안 속성 (ex: nofollow)
  }>();

  // URL이 http나 https로 시작하면 외부 링크로 간주합니다.
  const isExternal = computed(() => {
    return props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'));
  });

  // 외부 링크일 경우 보안을 위해 rel 속성에 noopener와 noreferrer를 보강합니다.
  const safeRel = computed(() => {
    if (isExternal.value) {
      return props.rel ? `${props.rel} noopener noreferrer` : 'noopener noreferrer';
    }
    return props.rel;
  });
</script>

<template>
  <NuxtLink
    :to="href"
    :target="isExternal ? '_blank' : target"
    :rel="safeRel"
    class="text-primary decoration-primary/30 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
  >
    <!-- 내부 텍스트 렌더링 영역 -->
    <slot />

    <!-- 외부 링크일 경우 사용자에게 새 창이 열린다는 힌트(아이콘)를 제공 -->
    <Icon
      v-if="isExternal"
      name="lucide:external-link"
      class="text-muted-foreground mx-1 mb-1 inline-block size-4"
    />
  </NuxtLink>
</template>
