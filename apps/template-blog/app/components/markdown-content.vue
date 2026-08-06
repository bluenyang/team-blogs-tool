<script setup lang="ts">
  import type { ComarkTree } from 'comark';

  interface MarkdownContentProps {
    postContent: string;
    postIdx: number;
    series?: SeriesItemInPost;
    currentPostIdx: number;
  }

  const { postContent, series, currentPostIdx } = defineProps<MarkdownContentProps>();

  const tree = ref<ComarkTree | null>(null);

  onMounted(async () => {
    if (!postContent) {
      return;
    }
    tree.value = await parseContent(postContent);
  });
</script>

<template>
  <div
    class="relative mx-auto flex max-w-7xl flex-col items-start space-y-12 space-x-8 lg:flex-row"
  >
    <!-- Main Content -->
    <main class="w-full min-w-0 flex-1 space-y-8">
      <!-- 모바일 TOC -->
      <div class="mb-8 block lg:hidden">
        <details class="bg-card border-border rounded-xl border p-4 shadow-sm">
          <summary
            class="text-foreground flex cursor-pointer items-center justify-between font-bold"
          >
            {{ '목차 보기' }}
            <Icon name="lucide:chevron-down" class="size-5" />
          </summary>
          <div class="mt-4">
            <TocLink v-if="tree?.meta.toc" :links="tree?.meta.toc.links" />
          </div>
        </details>
      </div>

      <!-- Series Box -->
      <SeriesBox
        v-if="series && currentPostIdx"
        :series="series"
        :current-post-idx="currentPostIdx"
      />

      <!-- Markdown Content -->
      <ComarkRenderer v-if="tree" :tree="tree" />
    </main>
    <!-- Floating Nav (TOC) - Left Side -->
    <aside v-if="postContent" class="hidden w-52 shrink-0 rounded-md lg:sticky lg:top-36 lg:block">
      <div class="flex flex-col text-sm">
        <div class="text-foreground mb-2 text-base font-semibold">{{ '목차' }}</div>
        <TocLink v-if="tree?.meta.toc" :links="tree?.meta.toc.links" class="space-y-4" />
      </div>
    </aside>
  </div>
</template>
