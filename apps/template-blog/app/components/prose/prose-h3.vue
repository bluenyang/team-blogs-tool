<script setup lang="ts">
  interface Props {
    id: string;
  }

  const { id } = defineProps<Props>();

  const copied = ref(false);

  async function copyLink(id?: string) {
    if (!id) return;

    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);

    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  }
</script>

<template>
  <h3 :id="id" class="group mt-8 mb-4 scroll-mt-24 font-bold">
    <span class="inline items-center gap-2 text-xl sm:text-2xl">
      <slot />
      <button
        v-if="id"
        type="button"
        class="text-muted-foreground hover:text-foreground ms-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        :aria-label="copied ? '링크 복사됨' : '링크 복사'"
        @click="copyLink(id)"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" />
      </button>
    </span>
  </h3>
</template>
