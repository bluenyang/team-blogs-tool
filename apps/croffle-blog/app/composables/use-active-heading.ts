import type { TocLink } from '~/components/toc-link.vue';

function flatten(links: TocLink[]): string[] {
  return links.flatMap((link) => [link.id, ...flatten(link.children ?? [])]);
}

/**
 * 현재 화면에 보이는 제목을 TOC 활성 항목으로 표시한다.
 * IntersectionObserver를 쓰되, 화면에 여러 제목이 걸릴 때는 가장 위쪽 것을 고른다.
 */
export function useActiveHeading(links: MaybeRefOrGetter<TocLink[]>) {
  const activeId = ref('');
  let observer: IntersectionObserver | null = null;

  const visible = new Set<string>();

  function pickTopmost() {
    const ids = flatten(toValue(links));
    const first = ids.find((id) => visible.has(id));
    if (first) activeId.value = first;
  }

  function observe() {
    observer?.disconnect();
    visible.clear();

    const ids = flatten(toValue(links));
    if (!ids.length) {
      activeId.value = '';
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        pickTopmost();
      },
      // 헤더 높이(약 76px)만큼 위를 잘라내고, 화면 아래쪽 절반은 무시한다
      { rootMargin: '-84px 0px -55% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    activeId.value = ids[0] ?? '';
  }

  onMounted(() => {
    // 본문이 렌더된 뒤에 관찰을 시작해야 heading 노드가 존재한다
    nextTick(observe);
  });

  watch(
    () => toValue(links),
    () => nextTick(observe),
  );

  onBeforeUnmount(() => observer?.disconnect());

  return { activeId };
}
