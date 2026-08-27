import type { MarkdownDocument } from 'comark';
import type { TocLink } from '~/components/toc-link.vue';

/**
 * 글 본문 마크다운을 파싱한다.
 *
 * 서버에서 실행되는 것이 핵심이다 — onMounted에서 파싱하면 SSR HTML에 본문이 없어
 * 크롤러가 제목·요약만 보게 된다. useAsyncData는 SSR 결과를 payload로 넘겨
 * 클라이언트에서 다시 파싱하지도 않는다.
 *
 * 같은 키로 여러 번 호출해도 Nuxt가 결과를 공유하므로 본문과 TOC가 각각 불러도 파싱은 1회다.
 */
export async function usePostContent(
  postIdx: MaybeRefOrGetter<number>,
  content: MaybeRefOrGetter<string | undefined>,
) {
  const { data } = await useAsyncData<MarkdownDocument | null>(
    () => `post-tree-${toValue(postIdx)}`,
    () => {
      const source = toValue(content);
      return source ? parseContent(source) : Promise.resolve(null);
    },
    { watch: [() => toValue(postIdx)] },
  );

  return {
    tree: data,
    toc: computed<TocLink[]>(() => data.value?.meta?.toc?.links ?? []),
  };
}
