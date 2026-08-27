import type { RawAuthorProfile, RawAuthors } from '@croffledev/directus-blog-core';

/**
 * Directus `blog_members.bio`는 아직 없을 수 있는 필드다.
 * 없는 필드를 요청하면 GraphQL이 문서 전체를 거절하므로 한 번만 확인하고 결과를 기억한다.
 * (undefined = 아직 모름)
 */
let bioFieldAvailable: boolean | undefined;

type QueryRunner<T> = (withBio: boolean) => Promise<T>;

/**
 * bio 필드 유무를 자동 감지하며 저자 쿼리를 실행한다.
 * 첫 호출에서 bio 포함으로 시도하고, 거절당하면 bio 없이 재시도한 뒤 그 판단을 캐시한다.
 */
export async function queryWithOptionalBio<T extends RawAuthors | RawAuthorProfile>(
  run: QueryRunner<T>,
): Promise<T> {
  if (bioFieldAvailable === false) {
    return run(false);
  }

  try {
    const result = await run(true);
    bioFieldAvailable = true;
    return result;
  } catch (error) {
    if (bioFieldAvailable === true) {
      throw error;
    }
    console.warn(
      '[nuxt-directus-blog] blog_members.bio를 읽지 못해 소개 없이 조회합니다. ' +
        'Directus에 bio 필드를 추가하고 public read 권한을 켜면 저자 소개가 표시됩니다.',
    );
    const result = await run(false);
    bioFieldAvailable = false;
    return result;
  }
}
