<template>
  <div class="relative flex min-h-screen flex-col">
    <div class="page-glow" aria-hidden="true" />

    <SiteHeader />

    <!-- 헤더는 최상단 64px에서 독 상태 68px(top 12 + 56)까지 움직인다 -->
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
