<script setup lang="ts">
  const profileData = useProfile();
</script>

<template>
  <div class="flex flex-col space-y-3 px-2 py-4">
    <div class="flex flex-col items-center justify-center gap-4">
      <NuxtImg
        src="/images/croffle.png"
        alt="Croffle Dev."
        class="size-24 rounded-full"
        format="webp"
        quality="80"
        fetchpriority="high"
        preload
      />
      <div class="space-y-1">
        <h3 class="text-center text-xl font-bold">{{ profileData.nickname }}</h3>
        <p class="font-jua text-muted-foreground text-start text-sm">
          {{ profileData.desc }}
        </p>
      </div>
    </div>
    <div class="flex justify-center gap-3">
      <a
        v-for="(link, index) in profileData.link"
        :key="index"
        :href="link.url"
        class="text-foreground hover:text-accent transition-transform duration-300 hover:-translate-y-0.5"
        :aria-label="link.name"
        :target="link.target"
      >
        <Icon :name="link.icon" class="size-5" />
      </a>
    </div>
  </div>
</template>
