<script setup lang="ts">
  const { displayText } = useSnippet();
  const { title } = useBlogBrand();
</script>

<template>
  <div class="relative z-0 flex h-screen w-full items-center justify-center">
    <div class="relative z-30 flex h-full flex-col items-center justify-center px-4 text-center">
      <strong
        class="animate-slide-up mb-8 text-5xl font-bold text-gray-800 transition-all duration-500 dark:text-gray-200"
      >
        {{ title }}
      </strong>
      <p class="animate-slide-up rounded-lg bg-black/50 px-4 pt-1 pb-2 text-xl">
        <code class="font-tektur text-sky-400"> {{ displayText }} </code>
        <span class="animate-blink mb-1 inline-block h-6 w-3 bg-sky-300 align-middle"></span>
      </p>
    </div>
    <div
      class="absolute z-20 h-full w-full bg-gray-500/50 transition-colors duration-500 dark:bg-black/50"
    ></div>
    <NuxtImg
      src="/images/image.png"
      alt="Blog hero image"
      class="animate-slow-zoom absolute z-10 h-full w-full object-cover"
      format="webp"
      quality="80"
      fetchpriority="high"
      preload
    />
  </div>
</template>
