/** 라우트 전환 중 클릭한 링크에 시각적 피드백을 주기 위한 헬퍼 */
export function useNavFeedback() {
  const pendingKey = ref<string | null>(null);
  const route = useRoute();

  watch(
    () => route.fullPath,
    () => {
      pendingKey.value = null;
    },
  );

  function onNavigate(key: string) {
    pendingKey.value = key;
  }

  function isPending(key: string) {
    return pendingKey.value === key;
  }

  return { pendingKey, onNavigate, isPending };
}
