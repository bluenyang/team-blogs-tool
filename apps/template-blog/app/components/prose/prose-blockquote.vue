<script setup lang="ts">
  defineProps<{
    as?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
  }>();

  const config = {
    note: {
      icon: 'i-lucide-info',
      label: 'Note',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-500',
    },
    tip: {
      icon: 'i-lucide-lightbulb',
      label: 'Tip',
      borderColor: 'border-green-500',
      textColor: 'text-green-500',
    },
    important: {
      icon: 'i-lucide-message-square-warning',
      label: 'Important',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-500',
    },
    warning: {
      icon: 'i-lucide-triangle-alert',
      label: 'Warning',
      borderColor: 'border-amber-600',
      textColor: 'text-amber-600',
    },
    caution: {
      icon: 'i-lucide-flame',
      label: 'Caution',
      borderColor: 'border-red-500',
      textColor: 'text-red-500',
    },
  };
</script>

<template>
  <div
    :class="
      cn(
        'border-blockquote-accent bg-block-bg my-4 rounded-md border-s-3 p-4',
        as && config[as].borderColor,
      )
    "
  >
    <div v-if="as" class="flex items-center gap-2">
      <Icon
        :name="config[as].icon"
        :class="cn('text-blockquote-accent', as && config[as].textColor)"
      />
      <span :class="cn('text-blockquote-accent font-jua text-lg', as && config[as].textColor)">
        {{ config[as].label }}
      </span>
    </div>
    <slot />
  </div>
</template>
