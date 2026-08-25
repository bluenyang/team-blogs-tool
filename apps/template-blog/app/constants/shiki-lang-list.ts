import { bundledLanguages } from 'shiki/langs';

const LANG_IDS = [
  'sh',
  'bash',
  'c',
  'cpp',
  'js',
  'javascript',
  'jsx',
  'ts',
  'typescript',
  'tsx',
  'vue',
  'css',
  'html',
  'json',
  'md',
  'mdc',
  'sql',
  'plsql',
  'yaml',
  'yml',
  'go',
  'java',
  'kotlin',
  'xml',
  'py',
  'dockerfile',
] as const;

export const shikiLangList = await Promise.all(
  LANG_IDS.map((id) => bundledLanguages[id]().then((mod) => mod.default)),
);
