import type { RawTagItem, RawTagItemInPost } from '../types/raw/tag.js';
import type { TagItem, TagItemInPost } from '../types/dto/tag.js';

export function tagMapper(raw: RawTagItem[]): TagItem[] {
  return raw.map((item) => ({
    name: item.name,
    slug: item.slug,
    postCount: Number(item.posts_func.count),
  }));
}

export function tagInPostMapper(raw: RawTagItemInPost[]): TagItemInPost[] {
  return raw.map((item) => ({
    name: item.tags_id.name,
    slug: item.tags_id.slug,
  }));
}
