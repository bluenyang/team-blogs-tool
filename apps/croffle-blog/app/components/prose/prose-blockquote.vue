<script setup lang="ts">
  const { as } = defineProps<{
    as?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
  }>();

  const CALLOUTS = {
    note: { icon: 'lucide:info', label: 'Note' },
    tip: { icon: 'lucide:lightbulb', label: 'Tip' },
    important: { icon: 'lucide:message-square-warning', label: 'Important' },
    warning: { icon: 'lucide:triangle-alert', label: 'Warning' },
    caution: { icon: 'lucide:flame', label: 'Caution' },
  } as const;

  const callout = computed(() => (as ? CALLOUTS[as] : null));
</script>

<template>
  <blockquote
    class="my-5 flex gap-3.5 rounded-lg border border-[oklch(0.785_0.104_69.8/0.22)] bg-[oklch(0.785_0.104_69.8/0.1)] px-4.5 py-4"
  >
    <div class="bg-primary w-0.75 shrink-0 rounded-xs" aria-hidden="true" />
    <div class="text-fg-80 min-w-0 flex-1 text-[14px] leading-[1.75] [&>p]:my-0 [&>p+p]:mt-3">
      <div v-if="callout" class="text-primary-soft mb-2 flex items-center gap-2 font-semibold">
        <Icon :name="callout.icon" class="size-4" />
        <span class="text-[13px]">{{ callout.label }}</span>
      </div>
      <slot />
    </div>
  </blockquote>
</template>
