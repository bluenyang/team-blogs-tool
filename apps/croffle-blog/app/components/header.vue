<script setup lang="ts">
  import { TransitionPresets } from '@vueuse/core';

  const profileData = useProfile();

  const { y } = useWindowScroll();
  const rawProgress = computed(() => {
    const progress = y.value / 160;
    return Math.max(0, Math.min(1, progress)); // 0과 1 사이로 값 고정 (Clamp)
  });

  const smoothProgress = useTransition(rawProgress, {
    duration: 400,
    transition: TransitionPresets.easeOutCubic,
  });

  // dock geometry (Scroll에 반응하는 동적 수치들)
  const marginTop = computed(() => smoothProgress.value * 12); // 0 -> 12
  const marginInline = computed(() => smoothProgress.value * 20); // 0 -> 20\
  const borderRadius = computed(() => smoothProgress.value * 32); // 0 -> 22
  const paddingY = computed(() => 16 - smoothProgress.value * 4); // 16 -> 12

  const { isOpen, toggle } = useSidebar();
</script>

<template>
  <header
    :class="
      cn(
        'pointer-events-none fixed top-0 right-0 left-0 z-50 flex h-18 transition-[left] duration-300 ease-in-out',
        isOpen && 'md:left-72',
      )
    "
  >
    <ClientOnly>
      <div
        v-motion="{
          initial: { opacity: 0, y: -20 },
          enter: { opacity: 1, y: 0, transition: { duration: 550, ease: 'easeOut' } },
        }"
        :class="
          cn(
            'pointer-events-auto absolute flex h-full flex-row items-center justify-center px-4 backdrop-blur-xl backdrop-brightness-104 backdrop-saturate-190 transition-colors duration-500',
            smoothProgress > 0.3 ? 'bg-header-tp' : 'bg-header-bg',
          )
        "
        :style="{
          top: `${marginTop}px`,
          left: `${marginInline}px`,
          right: `${marginInline}px`,
          borderRadius: `${borderRadius}px`,
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
        }"
      >
        <!-- Left side - Mobile menu toggler and Brand -->
        <div class="container flex flex-1 items-center gap-x-4">
          <button
            type="button"
            aria-label="메뉴 열기"
            :aria-expanded="isOpen"
            class="group inline-flex size-10 cursor-pointer items-center justify-center rounded-full p-2 transition-colors duration-300 hover:bg-white/80 dark:hover:bg-white/20"
            @click="toggle()"
          >
            <Icon name="lucide:menu" class="size-6" />
          </button>
          <div class="flex py-5 lg:flex-1">
            <NuxtLink class="group focus:outline-none" to="/">
              <span
                class="transition-color font-pacifico bg-linear-to-r from-blue-600 to-purple-700 bg-clip-text text-2xl font-bold duration-500 group-hover:text-transparent group-focus:text-transparent dark:from-blue-300 dark:to-purple-400"
              >
                {{ profileData.nickname }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Items - Theme Control Button -->
        <div class="container flex flex-1 items-center justify-end">
          <ThemeButton />
        </div>
      </div>
      <template #fallback>
        <div
          class="bg-header-bg pointer-events-auto absolute flex h-full w-full flex-row items-center justify-center px-4 backdrop-blur-xl"
        >
          <div class="container flex flex-1 items-center gap-x-4">
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded="false"
              class="inline-flex size-10 items-center justify-center rounded-full p-2"
            >
              <Icon name="lucide:menu" class="size-6" />
            </button>
            <div class="flex py-5 lg:flex-1">
              <NuxtLink class="group focus:outline-none" to="/">
                <span
                  class="font-pacifico bg-linear-to-r from-blue-600 to-purple-700 bg-clip-text text-2xl font-bold dark:from-blue-300 dark:to-purple-400"
                >
                  {{ profileData.nickname }}
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="container flex flex-1 items-center justify-end">
            <ThemeButton />
          </div>
        </div>
      </template>
    </ClientOnly>
  </header>
</template>
