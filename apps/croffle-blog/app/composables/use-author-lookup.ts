import type { AuthorItem, PostAuthor } from '@croffledev/directus-blog-core';

/**
 * 글에 붙어 오는 저자(PostAuthor)를 글쓴이 로스터와 이어 준다.
 *
 * PostAuthor에는 Directus 유저의 로마자 이름(예: "Ahn Kai")밖에 없어서, 실명·역할은
 * 로스터(homepage_team_members)에서 가져온다. 로스터는 이미 캐시된 payload라 추가 요청이 없다.
 */
export function useAuthorLookup() {
  const { authors } = useAuthors();

  const byNickname = computed(
    () => new Map(authors.value.map((author) => [author.nickname, author])),
  );

  function lookup(author: Pick<PostAuthor, 'nickname'>): AuthorItem | undefined {
    return author.nickname ? byNickname.value.get(author.nickname) : undefined;
  }

  /** 로스터의 실명을 우선하고, 없으면 Directus 유저 이름으로 폴백 */
  function realName(author: PostAuthor): string | null {
    return lookup(author)?.name ?? authorRealName(author);
  }

  return { lookup, realName };
}
