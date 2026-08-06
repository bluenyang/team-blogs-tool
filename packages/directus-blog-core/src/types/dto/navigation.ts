export interface NavigationItem {
  id: string;
  label: string;
  url: string | null;
  icon: string | null;
  isCategory: boolean;
  parentId: string | null;
  children?: NavigationItem[];
}
