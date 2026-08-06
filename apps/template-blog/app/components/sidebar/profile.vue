<script setup lang="ts">
  const profileData = useProfile();
  const { sidebar } = useSidebar();
  const totalPosts = computed(() => sidebar.value?.profile.totalPosts ?? 0);
</script>

<template>
  <div class="flex flex-col space-y-3 px-2 pb-4">
    <div class="flex items-center justify-start gap-4">
      <img
        v-if="profileData.githubProfileImage"
        :src="profileData.githubProfileImage"
        :alt="profileData.nickname"
        class="size-10 rounded-full border-2 border-white"
      />
      <div class="space-y-1">
        <h3 class="text-start text-xl font-bold">{{ profileData.nickname }}</h3>
        <p class="font-jua text-muted-foreground text-start text-sm">
          {{ profileData.desc }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-start gap-6">
      <div class="flex items-center gap-1">
        <span class="font-jua text-base font-bold">{{ totalPosts }}</span>
        <span class="text-muted-foreground flex text-sm">포스트</span>
      </div>
    </div>
    <div class="flex justify-start gap-3">
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
