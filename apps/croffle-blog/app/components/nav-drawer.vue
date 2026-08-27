<script setup lang="ts">
  import { PRIMARY_NAV, isNavActive } from '~/constants/navigation';

  const { isOpen, close } = useSidebar();
  const route = useRoute();

  const isLocked = useScrollLock(import.meta.client ? document.body : null);

  watch(isOpen, (open) => {
    isLocked.value = open;
  });

  watch(
    () => route.fullPath,
    () => close(),
  );

  onUnmounted(() => {
    isLocked.value = false;
  });
</script>

<template>
  <!-- Teleport 안에서는 Vue <Transition> 대신 CSS 진입 애니메이션을 쓴다(테마의 주석 참고) -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="animate-overlay-in fixed inset-0 z-60 bg-black/70 backdrop-blur-xs md:hidden"
      @click="close()"
    />

    <div
      v-if="isOpen"
      class="animate-drawer-in bg-background border-border-strong fixed inset-y-0 right-0 z-61 flex w-75 max-w-[86vw] flex-col overflow-y-auto border-l p-4 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="메뉴"
    >
      <div class="mb-4 flex items-center justify-between">
        <span class="mono-label">MENU</span>
        <button
          type="button"
          class="text-fg-60 hover:text-foreground grid size-11 cursor-pointer place-items-center rounded-full"
          aria-label="메뉴 닫기"
          @click="close()"
        >
          <Icon name="lucide:x" class="size-5" />
        </button>
      </div>

      <nav class="mb-5 flex flex-col gap-1" aria-label="주요 메뉴">
        <NuxtLink
          v-for="item in PRIMARY_NAV"
          :key="item.to"
          :to="item.to"
          :class="
            cn(
              'flex min-h-11 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors',
              isNavActive(item, route.path)
                ? 'bg-glass-2 text-foreground font-semibold'
                : 'text-fg-60 hover:text-foreground',
            )
          "
        >
          <Icon :name="item.icon" class="size-4.25" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <BlogSidebar />
    </div>
  </Teleport>
</template>
