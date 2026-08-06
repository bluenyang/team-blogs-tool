<script setup lang="ts">
  import LinkItems from './link-items.vue';

  const { sidebar } = useSidebar();

  const links = computed(() => sidebar.value?.navigations.items ?? []);
</script>

<template>
  <div v-if="links.length > 0" class="px-2 py-4">
    <div class="mb-1 px-2 text-sm font-bold">{{ '링크' }}</div>
    <ul class="flex flex-col">
      <LinkItems v-for="item in links" :key="item.id" :item="item" />
    </ul>
  </div>
</template>
