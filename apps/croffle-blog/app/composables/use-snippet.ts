import {
  initDeletingSpeed,
  initTypingSpeed,
  originalSnippets,
  waitTimeToDelete,
} from '~/constants/main-snippet';

export function useSnippet() {
  const displayText = ref<string>(originalSnippets[0] ?? '');

  // 현재 display되는 snippet의 idx, status, speed
  let typingSpeed: number = initTypingSpeed;
  let isDeleting: boolean = false;
  let currentIdx: number = 0;
  let randomizedSnippets: string[] = [];
  let animationTimeoutId: ReturnType<typeof setTimeout> | null = null;

  function shuffleSquence(array: string[]): string[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j]!, newArray[i]!];
    }
    return newArray;
  }

  function animate() {
    if (randomizedSnippets.length === 0) {
      randomizedSnippets = shuffleSquence(originalSnippets);
    }

    const fullText = randomizedSnippets[currentIdx];
    if (!fullText) {
      return;
    }

    if (isDeleting) {
      displayText.value = fullText?.substring(0, displayText.value.length - 1);
      typingSpeed = initDeletingSpeed;

      if (displayText.value === '') {
        isDeleting = false;
        const nextIdx = (currentIdx + 1) % randomizedSnippets.length;
        if (nextIdx === 0) {
          randomizedSnippets = shuffleSquence(originalSnippets);
        }

        currentIdx = nextIdx;
        typingSpeed = initTypingSpeed;
      }
    } else {
      displayText.value = fullText?.substring(0, displayText.value.length + 1);

      if (displayText.value === fullText) {
        typingSpeed = waitTimeToDelete;
        animationTimeoutId = setTimeout(() => {
          isDeleting = true;
          typingSpeed = initDeletingSpeed;
          animate();
        }, typingSpeed);
        return;
      }
    }

    animationTimeoutId = setTimeout(animate, typingSpeed);
  }

  onMounted(() => {
    displayText.value = '';
    currentIdx = 0;
    randomizedSnippets = shuffleSquence(originalSnippets);
    animate();
  });

  onUnmounted(() => {
    if (animationTimeoutId !== null) {
      clearTimeout(animationTimeoutId);
    }
  });

  return {
    displayText,
  };
}
