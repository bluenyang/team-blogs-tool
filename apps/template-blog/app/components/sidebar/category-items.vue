<script setup lang="ts">
  import type { CategoryItem } from '@croffledev/directus-blog-core';

  interface MenuItemProps {
    item: CategoryItem;
  }

  const { item } = defineProps<MenuItemProps>();
  const hasChildren = computed(() => item.children && item.children.length > 0);
  const route = useRoute();

  const isActive = computed(
    () =>
      route.name === 'categories-slug' &&
      decodeRouteSlug(String(route.params.slug || '')) === item.slug,
  );

  const checkActiveChild = (category: CategoryItem): boolean => {
    if (
      route.name === 'categories-slug' &&
      decodeRouteSlug(String(route.params.slug || '')) === category.slug
    ) {
      return true;
    }
    if (category.children) {
      return category.children.some((child) => checkActiveChild(child));
    }
    return false;
  };

  const hasActiveChild = computed(() => {
    if (!item.children) return false;
    return item.children.some((child) => checkActiveChild(child));
  });

  const isChildOpen = ref<boolean>(hasActiveChild.value);

  watch(
    () => route.path,
    () => {
      if (hasActiveChild.value) {
        isChildOpen.value = true;
      }
    },
  );

  const toggleChildOpen = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    isChildOpen.value = !isChildOpen.value;
  };
</script>

<template>
  <li class="">
    <div
      class="md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
    >
      <div
        :class="
          cn(
            'bg-sidebar group flex items-center justify-between gap-2 transition-all duration-200 md:hover:translate-x-1',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
          )
        "
      >
        <NuxtLink
          :to="{
            name: 'categories-slug',
            params: { slug: item.slug },
          }"
          class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1"
        >
          <Icon v-if="item.icon" :name="item.icon" class="size-5 shrink-0 text-sky-600" />
          <span
            :class="
              cn(
                'flex-1 truncate text-base font-medium transition-colors',
                isActive
                  ? 'text-sidebar-primary font-bold'
                  : 'md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300',
              )
            "
          >
            {{ item.name }}
          </span>
          <span
            :class="
              cn(
                'bg-sidebar-accent-hover rounded-full px-3 text-sm font-semibold',
                isActive && 'text-sidebar-primary-foreground bg-sidebar-primary',
              )
            "
          >
            {{ item.postCount || 0 }}
          </span>
        </NuxtLink>
        <button
          v-if="hasChildren"
          class="hover:bg-sidebar-accent-hover me-1 flex size-6 cursor-pointer items-center justify-center rounded-full focus:outline-none"
          :aria-expanded="isChildOpen"
          aria-label="Toggle children"
          @click="toggleChildOpen"
        >
          <Icon
            name="lucide:chevron-down"
            :class="cn('size-6 transition-transform duration-200', isChildOpen && 'rotate-180')"
          />
        </button>
      </div>
    </div>
    <div
      v-if="hasChildren"
      :class="
        cn(
          'grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-in-out',
          isChildOpen && 'grid-rows-[1fr]',
        )
      "
    >
      <div class="overflow-hidden">
        <ul class="bg-sidebar ps-3">
          <CategoryItems v-for="child in item.children" :key="child.slug" :item="child" />
        </ul>
      </div>
    </div>
  </li>
</template>
