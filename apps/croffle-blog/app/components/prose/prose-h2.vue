<script setup lang="ts">
  const { id } = defineProps<{ id: string }>();

  const copied = ref(false);

  async function copyLink() {
    if (!id) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}#${id}`,
    );
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }
</script>

<template>
  <h2
    :id="id"
    class="font-display group text-foreground sm:text-section mt-9 mb-4 flex scroll-mt-24 items-center gap-2.5 text-[19px] font-bold tracking-[-0.02em]"
  >
    <span class="bg-primary h-4.75 w-1 shrink-0 rounded-xs" aria-hidden="true" />
    <span class="min-w-0"><slot /></span>
    <button
      v-if="id"
      type="button"
      class="text-fg-40 hover:text-foreground shrink-0 cursor-pointer transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
      :aria-label="copied ? '링크 복사됨' : '링크 복사'"
      @click="copyLink()"
    >
      <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" />
    </button>
  </h2>
</template>
