import { parse } from '@comark/nuxt/parse';
import type { ComarkTree } from 'comark';

export async function parseContent(content: string): Promise<ComarkTree> {
  return parse(content, {
    plugins: comarkPlugins,
  });
}
