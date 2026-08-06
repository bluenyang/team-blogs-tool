<script setup lang="ts">
  const route = useRoute();
</script>

<template>
  <div class="flex flex-row">
    <Siderbar />

    <div class="relative flex min-w-0 grow flex-col">
      <Header />
      <div :class="cn('flex-1', route.path !== '/' && 'pt-12')">
        <slot />
      </div>
      <Footer />
    </div>
  </div>
</template>
