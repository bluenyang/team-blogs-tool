<script setup lang="ts">
  import type { MarkdownDocument } from 'comark';

  interface MarkdownContentProps {
    postContent: string;
    postIdx: number;
    series?: SeriesItemInPost;
    currentPostIdx: number;
  }

  const { postContent, postIdx, series, currentPostIdx } = defineProps<MarkdownContentProps>();

  /**
   * 본문은 서버에서 파싱한다.
   *
   * onMounted에서 파싱하면 SSR HTML에 본문이 한 글자도 실리지 않아 크롤러가 제목·요약만 본다.
   * useAsyncData로 옮기면 본문·코드 하이라이팅이 SSR 결과에 들어가고, payload로 그대로
   * 하이드레이션되어 클라이언트에서 다시 파싱하지 않는다.
   */
  const { data: tree } = await useAsyncData<MarkdownDocument | null>(
    () => `post-tree-${postIdx}`,
    () => (postContent ? parseContent(postContent) : Promise.resolve(null)),
    { watch: [() => postIdx] },
  );
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
      <MarkdownDocument v-if="tree" :value="tree" />
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
