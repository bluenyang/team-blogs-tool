<script setup lang="ts">
  const { settings } = useSetting();

  const visible = computed(() => !!settings.value?.allowCCL);
  const licenseCode = computed(() => getCclLicenseCode(settings.value));

  const commercialIcon = computed(() =>
    settings.value?.allowCommercial ? 'lucide:badge-dollar-sign' : 'lucide:banknote-x',
  );

  const changeIcon = computed(() => {
    switch (settings.value?.changeContent) {
      case 'share_alike':
        return 'lucide:refresh-cw';
      case 'no_derivative':
        return 'lucide:ban';
      case 'allow':
      default:
        return 'lucide:pencil-line';
    }
  });

  const tooltipLines = computed(() => {
    if (!settings.value?.allowCCL) return [];
    return [
      'Creative Commons 적용',
      `라이선스: ${licenseCode.value}`,
      getCclCommercialLabel(settings.value),
      getCclChangeLabel(settings.value),
      '자세한 내용은 라이선스 페이지에서 확인할 수 있습니다.',
    ];
  });
</script>

<template>
  <div v-if="visible" class="group relative inline-flex items-center">
    <span
      class="text-muted-foreground inline-flex items-center gap-1"
      :aria-label="`라이선스 ${licenseCode}`"
    >
      <Icon name="lucide:creative-commons" class="size-4 shrink-0" />
      <Icon :name="commercialIcon" class="size-4 shrink-0" />
      <Icon :name="changeIcon" class="size-4 shrink-0" />
    </span>
    <div
      role="tooltip"
      class="border-border bg-popover text-popover-foreground pointer-events-none absolute top-full left-0 z-20 mt-2 w-max max-w-80 rounded-md border px-3 py-2 text-left text-xs leading-relaxed opacity-0 shadow-md transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <p v-for="(line, index) in tooltipLines" :key="index" :class="index === 0 && 'font-semibold'">
        {{ line }}
      </p>
    </div>
  </div>
</template>
