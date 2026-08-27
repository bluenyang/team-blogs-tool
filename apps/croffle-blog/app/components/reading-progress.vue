<script setup lang="ts">
  const progress = ref(0);

  function update() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    progress.value = scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0;
  }

  onMounted(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  });
</script>

<template>
  <div
    class="fixed inset-x-3.5 top-17 z-40 h-0.75 overflow-hidden rounded-sm bg-white/[0.07] sm:inset-x-6 sm:top-19"
    role="progressbar"
    aria-label="읽기 진행률"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="bg-primary h-full origin-left transition-transform duration-100 ease-out"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>
