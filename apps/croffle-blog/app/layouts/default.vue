<template>
  <div class="relative flex min-h-screen flex-col">
    <div class="page-glow" aria-hidden="true" />

    <SiteHeader />

    <!-- 독 헤더(56px + 여백)와 모바일 하단 탭바를 피하는 여백 -->
    <main class="flex-1 pt-[76px] pb-6 sm:pt-[84px]">
      <slot />
    </main>

    <SiteFooter />

    <div class="h-16 sm:hidden" aria-hidden="true" />
    <MobileTabBar />
    <NavDrawer />
    <SearchPalette />
  </div>
</template>
