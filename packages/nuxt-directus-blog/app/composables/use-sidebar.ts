import type { SidebarContent } from '@croffledev/directus-blog-core';

export function useSidebar() {
  const isOpen = useState<boolean>('sidebar_is_open', () => false);
  const { data, pending, error } = useFetch<SidebarContent>('/api/sidebar', {
    method: 'GET',
    key: 'sidebar',
    getCachedData(key, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      }
    },
  });

  function toggle(): void {
    isOpen.value = !isOpen.value;
  }
  function close(): void {
    isOpen.value = false;
  }
  function open(): void {
    isOpen.value = true;
  }

  return {
    isOpen,
    sidebar: computed(() => data.value || undefined),
    pending,
    error,
    toggle,
    close,
    open,
  };
}
