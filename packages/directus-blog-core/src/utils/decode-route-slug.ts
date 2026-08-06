/** Decode route param slug (handles single/double encoding). */
export function decodeRouteSlug(raw: string): string {
  if (!raw) return '';

  let value = raw;
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }
  return value;
}
