import type { AssetUrlResolver } from '../asset-url.js';
import type { ImageQuery } from '../types/image.js';
import type {
  RawAuthorPostCount,
  RawAuthorProfile,
  RawAuthorTopicPost,
  RawAuthors,
  RawAuthorUser,
  RawBlogMember,
  RawTeamProfile,
} from '../types/raw/author.js';
import type { AuthorItem, AuthorLink, AuthorProfile, AuthorTopic } from '../types/dto/author.js';

import { postMapper } from './post.js';

/** 프로필 카드 104px @2x */
const authorAvatarQuery: ImageQuery = {
  width: 208,
  height: 208,
  format: 'webp',
  quality: 80,
  fit: 'cover',
};

function fullName(user: RawAuthorUser | null): string | null {
  if (!user) return null;
  const name = [user.last_name, user.first_name].filter(Boolean).join(' ').trim();
  return name || null;
}

function buildLinks(profile: RawTeamProfile | undefined): AuthorLink[] {
  if (!profile) return [];

  const links: AuthorLink[] = [];
  if (profile.github_username) {
    links.push({
      name: 'github',
      label: 'github',
      url: `https://github.com/${profile.github_username}`,
      icon: 'simple-icons:github',
    });
  }
  if (profile.blog) {
    links.push({
      name: 'blog',
      label: profile.blog.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      url: profile.blog,
      icon: 'lucide:notebook-pen',
    });
  }
  if (profile.homepage) {
    links.push({
      name: 'homepage',
      label: profile.homepage.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      url: profile.homepage,
      icon: 'lucide:globe',
    });
  }
  if (profile.linkedin) {
    links.push({
      name: 'linkedin',
      label: 'linkedin',
      url: profile.linkedin,
      icon: 'simple-icons:linkedin',
    });
  }
  if (profile.email) {
    links.push({
      name: 'mail',
      label: 'mail',
      url: `mailto:${profile.email}`,
      icon: 'lucide:mail',
    });
  }
  return links;
}

/** posts_aggregated(groupBy: ["author_id"]) 응답을 userId → 글 수 맵으로 */
function toPostCountMap(rows: RawAuthorPostCount[] | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows ?? []) {
    const group = row.group;
    const authorId =
      typeof group === 'string'
        ? (JSON.parse(group) as { author_id?: string | null }).author_id
        : group?.author_id;
    if (authorId) {
      map.set(authorId, Number(row.count?.id ?? 0));
    }
  }
  return map;
}

/** homepage_team_members를 user_id / nickname으로 찾을 수 있는 조회 테이블로 만든다. */
function indexTeamProfiles(raw: RawAuthors) {
  const byUserId = new Map<string, RawTeamProfile>();
  const byNickname = new Map<string, RawTeamProfile>();

  for (const profile of raw.teamProfiles ?? []) {
    if (profile.user_id?.id) byUserId.set(profile.user_id.id, profile);
    if (profile.nickname) byNickname.set(profile.nickname, profile);
  }

  return (user: RawAuthorUser | null): RawTeamProfile | undefined => {
    if (!user) return undefined;
    return byUserId.get(user.id) ?? (user.nickname ? byNickname.get(user.nickname) : undefined);
  };
}

function toAuthorItem(
  user: RawAuthorUser,
  member: RawBlogMember | undefined,
  profile: RawTeamProfile | undefined,
  postCount: number,
  resolveAssetUrl: AssetUrlResolver,
): AuthorItem {
  const nickname = user.nickname ?? profile?.nickname ?? '';

  return {
    id: user.id,
    slug: nickname || user.id,
    nickname: nickname || (fullName(user) ?? '이름 없음'),
    name: profile?.name ?? fullName(user),
    role: member?.role ?? null,
    bio: member?.bio ?? null,
    avatar: user.avatar?.id ? resolveAssetUrl(user.avatar.id, authorAvatarQuery) : null,
    postCount,
    links: buildLinks(profile),
  };
}

/**
 * 이 블로그의 필진 로스터.
 *
 * 멤버십의 기준은 **blog_members뿐이다**. homepage_team_members는 블로그 스코프가 없는
 * 팀 전체 명단이라, 실명·소셜 링크를 채우는 조회용으로만 쓴다. 이걸 멤버십 소스로 삼으면
 * 이 블로그와 무관한 팀원까지 필진에 올라온다.
 */
export function authorsMapper(raw: RawAuthors, resolveAssetUrl: AssetUrlResolver): AuthorItem[] {
  const postCounts = toPostCountMap(raw.authorPostCounts);
  const findProfile = indexTeamProfiles(raw);

  const authors = new Map<string, AuthorItem>();

  for (const member of raw.blogMembers ?? []) {
    const user = member.user_id;
    // user_id가 비어 있는 멤버십 행은 표시할 사람이 없으므로 건너뛴다
    if (!user?.id || authors.has(user.id)) continue;

    authors.set(
      user.id,
      toAuthorItem(user, member, findProfile(user), postCounts.get(user.id) ?? 0, resolveAssetUrl),
    );
  }

  // 글이 많은 사람이 앞. 동수면 닉네임 순으로 안정 정렬.
  return [...authors.values()].sort(
    (a, b) => b.postCount - a.postCount || a.nickname.localeCompare(b.nickname),
  );
}

/** 카테고리는 M2M이라 Directus groupBy가 안 되어, 저자 글 샘플에서 직접 집계한다. */
function tallyTopics(rows: RawAuthorTopicPost[] | null): AuthorTopic[] {
  const counts = new Map<string, AuthorTopic>();

  for (const row of rows ?? []) {
    for (const link of row.categories ?? []) {
      const category = link.categories_id;
      if (!category) continue;
      const entry = counts.get(category.slug);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(category.slug, { name: category.name, slug: category.slug, count: 1 });
      }
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function countSeries(rows: RawAuthorTopicPost[] | null): number {
  const slugs = new Set<string>();
  for (const row of rows ?? []) {
    for (const link of row.series ?? []) {
      if (link.series_id?.slug) slugs.add(link.series_id.slug);
    }
  }
  return slugs.size;
}

export function authorProfileMapper(
  raw: RawAuthorProfile,
  nickname: string,
  resolveAssetUrl: AssetUrlResolver,
): AuthorProfile | null {
  const roster = authorsMapper(raw, resolveAssetUrl);
  const totalCount = Number(raw.authorPostsCount?.[0]?.count?.id ?? 0);

  let author = roster.find((item) => item.slug === nickname || item.id === nickname);

  // blog_members에는 없지만 이 블로그에 발행 글이 있는 저자 — 글의 byline이 이 페이지를 가리키므로
  // 404로 끊지 않고 글에 실린 저자 정보로 프로필을 만든다.
  if (!author) {
    const postAuthor = raw.authorPosts?.[0]?.author_id;
    if (!postAuthor) {
      return null;
    }
    author = toAuthorItem(
      postAuthor,
      undefined,
      indexTeamProfiles(raw)(postAuthor),
      totalCount,
      resolveAssetUrl,
    );
  }

  return {
    author,
    posts: postMapper(raw.authorPosts ?? [], resolveAssetUrl),
    totalCount: Number(raw.authorPostsCount?.[0]?.count?.id ?? 0),
    topics: tallyTopics(raw.authorTopics),
    seriesCount: countSeries(raw.authorTopics),
    others: roster.filter((item) => item.id !== author.id),
  };
}
