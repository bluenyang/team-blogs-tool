<script setup lang="ts">
  export interface TocLink {
    id: string;
    text: string;
    depth: number;
    children?: TocLink[];
  }

  const { links } = defineProps<{
    links?: TocLink[];
  }>();
</script>

<template>
  <ul
    v-if="links?.length"
    class="space-y-2 border-l-2 border-neutral-400 ps-2 hover:border-cyan-400"
  >
    <li v-for="link in links" :key="link.id" class="text-muted-foreground">
      <a
        :href="`#${link.id}`"
        class="font-jua line-clamp-2 block leading-snug hover:font-semibold hover:text-cyan-600 dark:hover:text-cyan-500"
      >
        {{ link.text }}
      </a>
      <TocLink v-if="link.children?.length" :links="link.children" class="mt-2" />
    </li>
  </ul>
</template>
