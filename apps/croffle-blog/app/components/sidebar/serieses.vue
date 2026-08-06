<script setup lang="ts">
  const { sidebar } = useSidebar();
  const route = useRoute();

  const series = computed(() => sidebar.value?.series.items ?? []);

  function isActiveSeries(slug: string) {
    return (
      route.name === 'series-slug' && decodeRouteSlug(String(route.params.slug || '')) === slug
    );
  }
</script>

<template>
  <div v-if="series.length > 0" class="px-2 py-4">
    <div class="mb-1 px-2 text-sm font-bold">{{ '시리즈' }}</div>
    <ul class="flex flex-col">
      <li
        v-for="item in series"
        :key="item.slug"
        class="w-full md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
      >
        <div
          :class="
            cn(
              'bg-sidebar group relative flex w-full items-center gap-2 truncate transition-all duration-200 md:hover:translate-x-1',
              isActiveSeries(item.slug) && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )
          "
        >
          <NuxtLink
            :to="{
              name: 'series-slug',
              params: { slug: item.slug },
            }"
            class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1"
          >
            <Icon name="mdi:bookmark" class="size-5 shrink-0 text-sky-600" />
            <span
              :class="
                cn(
                  'truncate text-base font-medium transition-colors',
                  isActiveSeries(item.slug)
                    ? 'text-sidebar-primary font-bold'
                    : 'md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300',
                )
              "
            >
              {{ item.name }}
            </span>
            <span
              class="bg-sidebar-accent-hover rounded-full px-2 text-xs font-semibold"
              :class="
                cn(
                  isActiveSeries(item.slug) && 'text-sidebar-primary-foreground bg-sidebar-primary',
                )
              "
            >
              {{ item.postCount || 0 }}
            </span>
          </NuxtLink>
        </div>
      </li>
    </ul>
  </div>
</template>
