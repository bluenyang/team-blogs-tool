<script setup lang="ts">
  export interface TocLink {
    id: string;
    text: string;
    depth: number;
    children?: TocLink[];
  }

  const {
    links,
    activeId = '',
    depth = 0,
  } = defineProps<{
    links?: TocLink[];
    activeId?: string;
    depth?: number;
  }>();
</script>

<template>
  <ul v-if="links?.length" class="flex flex-col gap-2.5">
    <li v-for="link in links" :key="link.id" class="flex flex-col gap-2.5">
      <a
        :href="`#${link.id}`"
        :aria-current="activeId === link.id ? 'location' : undefined"
        :class="
          cn(
            'flex items-center gap-2.25 text-[12.5px] leading-snug transition-colors',
            activeId === link.id ? 'text-foreground font-medium' : 'text-fg-50 hover:text-fg-80',
          )
        "
        :style="{ paddingLeft: `${depth * 12}px` }"
      >
        <span
          :class="
            cn(
              'h-3.25 w-0.5 shrink-0 rounded-[1px]',
              activeId === link.id ? 'bg-primary' : 'bg-transparent',
            )
          "
        />
        <span class="line-clamp-2">{{ link.text }}</span>
      </a>

      <TocLink
        v-if="link.children?.length"
        :links="link.children"
        :active-id="activeId"
        :depth="depth + 1"
      />
    </li>
  </ul>
</template>
