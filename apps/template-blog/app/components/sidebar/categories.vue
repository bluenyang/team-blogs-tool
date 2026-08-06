<script setup lang="ts">
  import CategoryItems from './category-items.vue';

  const { sidebar } = useSidebar();
  const route = useRoute();

  const categories = computed(() => sidebar.value?.categories.items ?? []);
  const totalPosts = computed(() => sidebar.value?.profile.totalPosts ?? 0);
</script>

<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-sm font-bold">{{ '카테고리' }}</div>
    <ul class="flex flex-col">
      <li
        class="relative w-full md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
      >
        <div
          :class="
            cn(
              'bg-sidebar group flex items-center justify-between gap-2 transition-all duration-200 md:hover:translate-x-1',
              route.path === '/posts' && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )
          "
        >
          <NuxtLink
            :to="{ name: 'posts' }"
            class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1"
          >
            <Icon
              v-if="!route.path.startsWith('/posts')"
              name="lucide:archive"
              class="size-4 shrink-0 text-sky-600"
            />
            <Icon v-else name="lucide:archive" class="text-sidebar-primary size-4 shrink-0" />
            <span
              :class="
                cn(
                  'text-lg font-medium transition-colors',
                  route.path === '/posts'
                    ? 'text-sidebar-primary font-bold'
                    : 'group-hover:text-purple-700 dark:group-hover:text-indigo-300',
                )
              "
            >
              {{ '전체 글' }}
            </span>
            <span
              :class="
                cn(
                  'bg-sidebar-accent-hover rounded-full px-3 text-sm font-semibold',
                  route.path === '/posts' && 'text-sidebar-primary-foreground bg-sidebar-primary',
                )
              "
            >
              {{ totalPosts }}
            </span>
          </NuxtLink>
        </div>
      </li>
      <CategoryItems v-for="item in categories" :key="item.slug" :item="item" />
    </ul>
  </div>
</template>
