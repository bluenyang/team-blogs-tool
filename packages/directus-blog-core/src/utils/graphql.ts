const GRAPHQL_ESCAPES: Record<string, string> = {
  '\\': '\\\\',
  '"': '\\"',
  '\n': '\\n',
  '\t': '\\t',
  '\r': '',
};

/**
 * GraphQL 문자열 리터럴 이스케이프.
 *
 * 쿼리를 템플릿 문자열로 조립하므로, 사용자 입력(검색어·슬러그·닉네임)이 그대로 보간되면
 * 따옴표 하나로 쿼리 전체가 깨지거나 필터가 주입된다. 값은 반드시 이 헬퍼를 통과시킨다.
 */
export function escapeGraphQLString(value: string): string {
  return value.replace(/[\\"\n\t\r]/g, (char) => GRAPHQL_ESCAPES[char] ?? char);
}

/** 이스케이프된 GraphQL 문자열 리터럴(따옴표 포함)을 만든다. */
export function gqlString(value: string): string {
  return `"${escapeGraphQLString(value)}"`;
}

/** 이스케이프된 GraphQL 문자열 리스트 리터럴을 만든다. */
export function gqlStringList(values: readonly string[]): string {
  return `[${values.map(gqlString).join(', ')}]`;
}
