<script setup lang="ts">
  const { isOpen: isSidebarOpen, close: closeSidebar } = useSidebar();

  const isLocked = useScrollLock(import.meta.client ? document.body : null);

  watch(isSidebarOpen, (isOpen) => {
    if (import.meta.client) {
      if (isOpen && window.innerWidth < 768) {
        isLocked.value = true;
      } else {
        isLocked.value = false;
      }
    }
  });

  const route = useRoute();
  watch(
    () => route.fullPath,
    () => {
      if (import.meta.client && window.innerWidth < 768) {
        closeSidebar();
      }
    },
  );
</script>

<template>
  <div class="relative z-100 md:hidden">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/70 backdrop-blur-xs"
        @click="closeSidebar"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isSidebarOpen"
        class="bg-sidebar fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col overflow-y-auto shadow-xl"
      >
        <SidebarContent />
      </div>
    </Transition>
  </div>

  <aside
    :class="
      cn(
        'bg-sidebar border-sidebar-border sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r transition-all duration-300 ease-in-out md:block',
        isSidebarOpen ? 'w-72' : 'w-0 border-r-0',
      )
    "
  >
    <div class="flex h-full w-72 flex-col overflow-y-auto">
      <SidebarContent />
    </div>
  </aside>
</template>
