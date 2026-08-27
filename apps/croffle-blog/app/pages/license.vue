<script setup lang="ts">
  const { settings } = useSetting();
  // sidebar fetch로 settings 채움
  useSidebar();

  const licenseCode = computed(() => getCclLicenseCode(settings.value));
  const commercialLabel = computed(() => getCclCommercialLabel(settings.value));
  const changeLabel = computed(() => getCclChangeLabel(settings.value));
  const ccUrl = computed(() => getCclCreativeCommonsUrl(settings.value));

  const config = useRuntimeConfig();
  const { siteName, description } = useBlogBrand();
  const canonicalUrl = `${config.public.blogUrl}/license`;
  const licenseDesc = computed(() => `${siteName.value} 콘텐츠 및 소스코드 라이선스 안내`);

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title: 'License',
    description: licenseDesc,
    ogTitle: 'License',
    ogDescription: licenseDesc,
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });
</script>

<template>
  <div class="mx-auto w-full max-w-205 px-5 pt-4 pb-11.5 sm:px-10">
    <header class="mb-9 flex flex-col gap-2">
      <span
        class="text-fg-40 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-widest"
      >
        <Icon name="lucide:scale" class="size-3.5" />
        LICENSE
      </span>
      <h1 class="font-display text-[30px] font-extrabold tracking-[-0.03em]">라이선스</h1>
      <p class="text-fg-50 text-[13.5px] leading-[1.7]">
        이 블로그 콘텐츠와 소스코드에 적용되는 이용 조건을 안내합니다.
      </p>
    </header>

    <div v-if="!settings" class="glass flex animate-pulse flex-col gap-3 rounded-xl p-6">
      <div class="skeleton h-6 w-40" />
      <div class="skeleton h-4 w-full" />
      <div class="skeleton h-4 w-2/3" />
    </div>

    <EmptyState
      v-else-if="!settings.allowCCL"
      icon="lucide:scale"
      title="공개된 Creative Commons 라이선스 설정이 없습니다."
    />

    <div v-else class="flex flex-col gap-4">
      <section class="glass flex flex-col gap-4 rounded-xl p-6">
        <div class="flex flex-wrap items-center gap-3">
          <CclBadge />
          <span class="font-display text-section font-bold">{{ licenseCode }}</span>
        </div>
        <ul class="text-fg-60 flex flex-col gap-2 text-[13.5px] leading-[1.7]">
          <li>· 저작자 표시(Attribution) 필요</li>
          <li>· {{ commercialLabel }}</li>
          <li>· {{ changeLabel }}</li>
        </ul>
        <a
          v-if="ccUrl"
          :href="ccUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-80"
        >
          Creative Commons 전문 보기
          <Icon name="lucide:external-link" class="size-3.5" />
        </a>
      </section>

      <section v-if="settings.licenseNote" class="glass flex flex-col gap-3 rounded-xl p-6">
        <span class="mono-label">이용 안내</span>
        <p class="text-fg-60 text-[13.5px] leading-[1.75] whitespace-pre-line">
          {{ settings.licenseNote }}
        </p>
      </section>
    </div>
  </div>
</template>
