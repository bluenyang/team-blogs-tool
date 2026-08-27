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
  <h3
    :id="id"
    class="font-display group text-foreground mt-7 mb-3 flex scroll-mt-24 items-center gap-2 text-[17px] font-bold tracking-[-0.02em]"
  >
    <span class="min-w-0"><slot /></span>
    <button
      v-if="id"
      type="button"
      class="text-fg-40 hover:text-foreground shrink-0 cursor-pointer transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
      :aria-label="copied ? '링크 복사됨' : '링크 복사'"
      @click="copyLink()"
    >
      <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-3.5" />
    </button>
  </h3>
</template>
