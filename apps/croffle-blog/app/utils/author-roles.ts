/** Directus blog_members.role → 화면 라벨 */
export const ROLE_LABELS: Record<string, string> = {
  owner: '팀장',
  admin: '운영',
  editor: '필진',
  author: '필진',
  member: '멤버',
};

export function roleLabel(role: string | null | undefined): string | null {
  if (!role) return null;
  return ROLE_LABELS[role] ?? role;
}
