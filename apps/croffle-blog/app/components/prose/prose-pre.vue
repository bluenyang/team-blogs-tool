<script setup lang="ts">
  import { langIcon } from '~/constants/language-icons';

  const props = defineProps<{
    code?: string;
    language?: string;
    /** ```ts title=foo.ts 형태의 메타 — 파일명 표시에 쓴다 */
    meta?: string;
    filename?: string;
    class?: string;
  }>();

  const copied = ref(false);

  async function copyCode() {
    await navigator.clipboard.writeText(props.code ?? '');
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }

  const iconName = computed(() => {
    if (!props.language) return null;
    const icon = langIcon[props.language.toLowerCase()];
    return icon ? `devicon:${icon}` : null;
  });

  const label = computed(
    () =>
      props.filename ||
      props.meta?.match(/(?:title|filename)=["']?([^"'\s]+)/)?.[1] ||
      props.language ||
      'text',
  );
</script>

<template>
  <div class="border-border-strong my-5 overflow-hidden rounded-lg border">
    <div
      class="bg-glass-2 text-fg-50 flex items-center justify-between gap-3 px-3.75 py-2.5 font-mono text-[11px] font-medium"
    >
      <span class="flex min-w-0 items-center gap-2">
        <Icon v-if="iconName" :name="iconName" class="size-4 shrink-0" />
        <span class="truncate">{{ label }}</span>
      </span>
      <button
        type="button"
        class="hover:text-foreground flex shrink-0 cursor-pointer items-center gap-1.5 transition-colors"
        :aria-label="copied ? '복사됨' : '코드 복사'"
        @click="copyCode()"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-3.5" />
        {{ copied ? 'copied' : 'copy' }}
      </button>
    </div>
    <pre
      :class="
        cn(
          'bg-code-bg text-fg-80 overflow-x-auto px-4.5 py-4 font-mono text-[12.5px] leading-[1.9] [&>code]:font-mono',
          props.class,
        )
      "
    ><slot /></pre>
  </div>
</template>
