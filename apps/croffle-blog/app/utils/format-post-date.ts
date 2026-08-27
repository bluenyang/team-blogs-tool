/** SSR/클라이언트 타임존 차이로 hydration mismatch가 나지 않도록 UTC 기준 포맷 */
function parts(dateString: string | null | undefined) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return {
    yyyy: String(date.getUTCFullYear()),
    mm: String(date.getUTCMonth() + 1).padStart(2, '0'),
    dd: String(date.getUTCDate()).padStart(2, '0'),
    date,
  };
}

/** 2026.08.21 — 카드·리스트 메타 기본형 */
export function formatPostDateYmd(dateString: string | null | undefined): string {
  const p = parts(dateString);
  return p ? `${p.yyyy}.${p.mm}.${p.dd}` : '';
}

/** 08.21 — 모바일 카드처럼 폭이 좁은 곳 */
export function formatPostDateShort(dateString: string | null | undefined): string {
  const p = parts(dateString);
  return p ? `${p.mm}.${p.dd}` : '';
}

/** <time datetime> 용 ISO 날짜 */
export function formatPostDateIso(dateString: string | null | undefined): string {
  const p = parts(dateString);
  return p ? `${p.yyyy}-${p.mm}-${p.dd}` : '';
}

export function formatPostDateLong(dateString: string | null | undefined): string {
  const p = parts(dateString);
  if (!p) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(p.date);
}
