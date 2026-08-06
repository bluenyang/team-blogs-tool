<script setup lang="ts">
  const profileData = useProfile();
  const { sidebar } = useSidebar();
  const config = useRuntimeConfig();

  const categories = computed(() => sidebar.value?.categories.items ?? []);
  const currentYear = new Date().getFullYear();
  const githubLink = computed(() => profileData.value.link.find((l) => l.name === 'github'));
  const homepageUrl = computed(() => (config.public.homepageUrl as string) || '');
</script>

<template>
  <footer class="bg-card border-border mt-auto border-t">
    <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        <div class="col-span-1 lg:col-span-2">
          <div class="flex items-center gap-4">
            <img
              v-if="profileData.githubProfileImage"
              :src="profileData.githubProfileImage"
              alt="Profile"
              class="size-12 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <h3 class="text-foreground text-lg font-bold">{{ profileData.nickname }}</h3>
              <p class="font-jua text-muted-foreground text-sm">{{ profileData.desc }}</p>
            </div>
          </div>
          <div class="mt-6 flex gap-4">
            <a
              v-if="githubLink"
              :href="githubLink.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Icon name="mdi:github" class="size-6" />
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="RSS"
            >
              <Icon name="mdi:rss" class="size-6" />
            </a>
            <a
              v-if="config.public.emailAddress"
              :href="`mailto:${config.public.emailAddress}`"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Icon name="mdi:email" class="size-6" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
            카테고리
          </h3>
          <ul class="space-y-2">
            <li v-for="category in categories.slice(0, 5)" :key="category.slug">
              <NuxtLink
                :to="`/categories/${category.slug}`"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">링크</h3>
          <ul class="space-y-2">
            <li v-if="homepageUrl">
              <a
                :href="homepageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Homepage
              </a>
            </li>
            <li>
              <NuxtLink
                to="/license"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                License
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
        © {{ currentYear }} {{ profileData.nickname }}. All rights reserved.
      </div>
    </div>
  </footer>
</template>
