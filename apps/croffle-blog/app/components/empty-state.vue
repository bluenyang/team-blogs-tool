<script setup lang="ts">
  const {
    icon = 'lucide:file-text',
    title,
    description = '',
    tone = 'muted',
  } = defineProps<{
    icon?: string;
    title: string;
    description?: string;
    tone?: 'muted' | 'error';
  }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-20 text-center">
    <Icon :name="icon" :class="cn('size-10', tone === 'error' ? 'text-primary' : 'text-fg-35')" />
    <p :class="cn('text-[15px]', tone === 'error' ? 'text-foreground' : 'text-fg-60')">
      {{ title }}
    </p>
    <p v-if="description" class="text-fg-40 max-w-md text-[12.5px]">{{ description }}</p>
    <slot />
  </div>
</template>
