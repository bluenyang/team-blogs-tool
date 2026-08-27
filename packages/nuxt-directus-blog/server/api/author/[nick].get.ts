import type { AuthorProfile, RawAuthorProfile } from '@croffledev/directus-blog-core';
import { decodeRouteSlug } from '@croffledev/directus-blog-core';

/**
 * 저자 한 명의 프로필 + 글 아카이브.
 *
 * 로스터(역할·소셜·다른 필진)와 글 목록·주제 분포를 한 GraphQL 문서로 합쳐
 * 페이지 전체가 Directus 왕복 1회로 끝난다.
 */
export default defineCachedEventHandler(
  async (event): Promise<AuthorProfile> => {
    const nickname = decodeRouteSlug(String(getRouterParam(event, 'nick') ?? ''));

    if (!nickname) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid author' });
    }

    const query = getQuery(event);
    const limit = Math.min(Number(query.limit) || 10, 50);
    const page = Math.max(Number(query.page) || 1, 1);
    const offset = (page - 1) * limit;

    const { client, mappers } = useBlogCore();
    const { buildQuery, authors, authorProfile } = useQuery();

    try {
      const result = await queryWithOptionalBio<RawAuthorProfile>((withBio) =>
        client.query<RawAuthorProfile>(
          buildQuery(authors(withBio), authorProfile({ nickname, limit, offset })),
        ),
      );

      const profile = mappers.authorProfile(result, nickname);

      if (!profile) {
        throw createError({ statusCode: 404, statusMessage: 'Author not found' });
      }

      return profile;
    } catch (error) {
      if (isError(error)) {
        throw error;
      }
      console.error('Failed to fetch author profile:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch author profile',
      });
    }
  },
  {
    name: 'author',
    maxAge: 180,
    swr: true,
    getKey: (event) => {
      const query = getQuery(event);
      const nick = String(getRouterParam(event, 'nick') ?? '');
      return `${nick}|l${query.limit ?? 10}|p${query.page ?? 1}`;
    },
  },
);
