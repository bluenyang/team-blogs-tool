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
  <main class="container mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-10">
      <div class="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Icon name="lucide:scale" class="size-4" />
        <span class="tracking-widest uppercase">{{ 'License' }}</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ '라이선스' }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">
        {{ '이 블로그 콘텐츠와 소스코드에 적용되는 이용 조건을 안내합니다.' }}
      </p>
    </div>

    <div v-if="!settings" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <div v-else-if="!settings.allowCCL" class="text-muted-foreground py-12 text-center">
      <p>{{ '현재 공개된 Creative Commons 라이선스 설정이 없습니다.' }}</p>
    </div>

    <div v-else class="space-y-10">
      <section class="border-border space-y-4 border-b pb-10">
        <div class="flex flex-wrap items-center gap-3">
          <CclBadge />
          <span class="text-foreground text-xl font-bold">{{ licenseCode }}</span>
        </div>
        <ul class="text-muted-foreground space-y-2 text-sm leading-relaxed">
          <li>{{ '· 저작자 표시(Attribution) 필요' }}</li>
          <li>{{ `· ${commercialLabel}` }}</li>
          <li>{{ `· ${changeLabel}` }}</li>
        </ul>
        <a
          v-if="ccUrl"
          :href="ccUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
        >
          <span>{{ 'Creative Commons 전문 보기' }}</span>
          <Icon name="lucide:external-link" class="size-3.5" />
        </a>
      </section>

      <section v-if="settings.licenseNote" class="space-y-3">
        <h2 class="text-foreground text-lg font-semibold">{{ '이용 안내' }}</h2>
        <p class="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
          {{ settings.licenseNote }}
        </p>
      </section>
    </div>
  </main>
</template>
