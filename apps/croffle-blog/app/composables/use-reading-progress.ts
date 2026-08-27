/**
 * 읽기 진행률 — 헤더 독 하단에 붙는 바가 읽고, 글 상세 페이지가 켠다.
 *
 * 바를 헤더 안에 두기 때문에 상태를 공유해야 한다. 바가 독의 자식이면 좌우 여백·폭·모서리가
 * 헤더와 자동으로 같이 움직여서, 스크롤에 따라 헤더가 좁아질 때 진행 바도 그대로 따라간다.
 */
export function useReadingProgress() {
  const progress = useState<number>('reading-progress', () => 0);
  const isActive = useState<boolean>('reading-progress-active', () => false);

  return { progress, isActive };
}

/** 글 상세 페이지에서 호출한다. 스크롤을 추적하고, 페이지를 벗어나면 바를 끈다. */
export function useTrackReadingProgress() {
  const { progress, isActive } = useReadingProgress();

  // setup 시점에 켜서 SSR 마크업에도 바가 포함되게 한다 — 하이드레이션 후 뒤늦게 나타나지 않는다
  isActive.value = true;
  progress.value = 0;

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
    isActive.value = false;
    progress.value = 0;
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  });
}
