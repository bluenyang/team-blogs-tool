export interface RawAuthorUser {
  id: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar: { id: string } | null;
}

export interface RawBlogMember {
  id: string;
  role: string | null;
  /** Directus에 blog_members.bio가 추가되기 전에는 응답에 없다. */
  bio?: string | null;
  user_id: RawAuthorUser | null;
}

export interface RawTeamProfile {
  nickname: string | null;
  name: string | null;
  github_username: string | null;
  email: string | null;
  linkedin: string | null;
  homepage: string | null;
  blog: string | null;
  user_id: RawAuthorUser | null;
}

export interface RawAuthorPostCount {
  group: { author_id: string | null } | string | null;
  count: { id: number };
}

export interface RawAuthors {
  blogMembers: RawBlogMember[] | null;
  teamProfiles: RawTeamProfile[] | null;
  authorPostCounts: RawAuthorPostCount[] | null;
}

export interface RawAuthorTopicPost {
  categories: { categories_id: { name: string; slug: string } }[] | null;
  series: { series_id: { name: string; slug: string } }[] | null;
}

export interface RawAuthorProfile extends RawAuthors {
  authorPosts: import('./post.js').RawPostItem[] | null;
  authorPostsCount: { count: { id: number } }[] | null;
  authorTopics: RawAuthorTopicPost[] | null;
}
