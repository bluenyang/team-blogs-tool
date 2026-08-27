export * from './author.js';
export * from './category.js';
export * from './home.js';
export * from './post.js';
export * from './seo.js';
export * from './series.js';
export * from './sidebar.js';
export * from './tag.js';

/** Join GraphQL field selections into a single query document. */
export function buildQuery(...queries: (string | undefined)[]) {
  const query = queries.filter(Boolean).join('\n');
  return `query {\n  ${query}\n}`;
}
