export type NavItem = {
  label: string;
  to: string;
  icon: string;
  /** 하위 경로까지 활성으로 볼지 */
  prefix?: boolean;
};

/** 독 헤더 중앙 nav와 모바일 하단 탭바가 공유하는 1차 내비게이션 */
export const PRIMARY_NAV: NavItem[] = [
  { label: '전체 글', to: '/posts', icon: 'lucide:layout-grid', prefix: true },
  { label: '시리즈', to: '/series', icon: 'lucide:layers', prefix: true },
  { label: '태그', to: '/tags', icon: 'lucide:tag', prefix: true },
  { label: '필진', to: '/authors', icon: 'lucide:users', prefix: true },
];

export const MOBILE_NAV: NavItem[] = [
  { label: '홈', to: '/', icon: 'lucide:home' },
  { label: '시리즈', to: '/series', icon: 'lucide:layers', prefix: true },
  { label: '태그', to: '/tags', icon: 'lucide:tag', prefix: true },
  { label: '필진', to: '/authors', icon: 'lucide:users', prefix: true },
];

export function isNavActive(item: NavItem, path: string): boolean {
  if (item.prefix) {
    return path === item.to || path.startsWith(`${item.to}/`);
  }
  return path === item.to;
}
