<script setup lang="ts">
  import type { NavigationItem } from '@croffledev/directus-blog-core';

  interface LinkItemProps {
    item: NavigationItem;
  }

  const { item } = defineProps<LinkItemProps>();
  const hasChild = computed<boolean>(() => !!item.children && item.children.length > 0);

  const childOpen = ref<boolean>(false);

  const linkContentClass = 'flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5';

  const rowClass = computed(() =>
    cn(
      'flex items-center justify-between rounded-lg',
      !hasChild.value &&
        item.url &&
        'md:hover:bg-accent md:hover:text-accent-foreground cursor-pointer',
    ),
  );

  const toggleChild = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    childOpen.value = !childOpen.value;
  };
</script>

<template>
  <li>
    <div :class="rowClass">
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        :class="linkContentClass"
      >
        <Icon :name="item.icon || 'lucide:link'" class="size-5 shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </a>
      <span v-else :class="linkContentClass">
        <Icon :name="item.icon || 'lucide:link'" class="size-5 shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </span>
      <button
        v-if="hasChild"
        type="button"
        aria-label="하위 링크 펼치기"
        :aria-expanded="childOpen"
        class="md:hover:bg-sidebar-accent me-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full"
        @click="toggleChild"
      >
        <Icon
          name="lucide:chevron-down"
          :class="cn('size-6 transition-transform duration-200', childOpen && 'rotate-180')"
        />
      </button>
    </div>
    <div
      v-if="hasChild"
      :class="
        cn(
          'grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out',
          childOpen && 'grid-rows-[1fr]',
        )
      "
    >
      <div class="overflow-hidden">
        <ul class="ps-3">
          <LinkItems v-for="child in item.children" :key="child.id" :item="child" />
        </ul>
      </div>
    </div>
  </li>
</template>
