<script setup lang="ts">
  const colorMode = useColorMode();

  const isDark = computed(() => colorMode.value === 'dark');

  function toggleColorMode() {
    // system이 남아 있으면 명시적으로 light/dark로 고정
    colorMode.preference = isDark.value ? 'light' : 'dark';
  }
</script>

<template>
  <ClientOnly>
    <button
      class="cursor-pointer rounded-full p-2 transition-colors duration-200 hover:bg-white dark:hover:bg-white/20"
      aria-label="Toggle theme"
      @click="toggleColorMode"
    >
      <span class="flex items-center justify-center">
        <Icon v-if="isDark" name="lucide:moon" class="size-5" />
        <Icon v-else name="lucide:sun" class="size-5" />
      </span>
    </button>
    <template #placeholder>
      <button
        class="cursor-pointer rounded-full p-2 transition-colors duration-200"
        aria-label="Toggle theme"
        disabled
      >
        <span class="flex items-center justify-center">
          <Icon name="lucide:moon" class="size-5" />
        </span>
      </button>
    </template>
  </ClientOnly>
</template>
