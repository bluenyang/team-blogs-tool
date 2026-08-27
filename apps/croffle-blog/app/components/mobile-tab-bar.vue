<script setup lang="ts">
  import { MOBILE_NAV, isNavActive } from '~/constants/navigation';

  const route = useRoute();
</script>

<template>
  <nav
    class="glass-dock fixed inset-x-3.5 bottom-3.5 z-40 flex justify-around rounded-2xl px-2 py-1.5 sm:hidden"
    aria-label="모바일 주요 메뉴"
  >
    <NuxtLink
      v-for="item in MOBILE_NAV"
      :key="item.to"
      :to="item.to"
      :aria-current="isNavActive(item, route.path) ? 'page' : undefined"
      :class="
        cn(
          'flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10.5px] transition-colors',
          isNavActive(item, route.path) ? 'text-primary font-semibold' : 'text-fg-40',
        )
      "
    >
      <Icon :name="item.icon" class="size-4.5" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
