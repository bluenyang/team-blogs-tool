import { parseMarkdown } from '@comark/nuxt/parse';
import type { MarkdownDocument } from 'comark';

export async function parseContent(content: string): Promise<MarkdownDocument> {
  return parseMarkdown(content, {
    plugins: comarkPlugins,
  });
}
