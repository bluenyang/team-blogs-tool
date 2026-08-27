/** ⌘K 팔레트의 열림 상태 — 헤더 트리거와 팔레트가 공유한다. */
export function useSearchPalette() {
  const isOpen = useState<boolean>('search_palette_open', () => false);

  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return { isOpen, open, close, toggle };
}
