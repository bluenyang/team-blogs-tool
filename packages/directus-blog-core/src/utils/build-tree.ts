export function buildTree<T extends { id: string; parentId: string | null; children?: T[] }>(
  items: T[],
): T[] {
  const itemMap = new Map<string, T>();
  const rootItems: T[] = [];

  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const mappedItem = itemMap.get(item.id)!;
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children?.push(mappedItem);
      }
    } else {
      rootItems.push(mappedItem);
    }
  });

  return rootItems;
}
