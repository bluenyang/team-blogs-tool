import { bundledLanguagesInfo } from 'shiki/langs';

/** Shiki canonical id → devicon 이름 */
const LANG_ICON_BY_ID: Record<string, string> = {
  bash: 'bash',
  c: 'c',
  cpp: 'cplusplus',
  javascript: 'javascript',
  jsx: 'react',
  typescript: 'typescript',
  tsx: 'react',
  vue: 'vuejs',
  css: 'css3',
  html: 'html5',
  json: 'json',
  markdown: 'markdown',
  mdc: 'markdown',
  sql: 'postgresql',
  plsql: 'sqldeveloper',
  yaml: 'yaml',
  go: 'go',
  java: 'java',
  kotlin: 'kotlin',
  python: 'python',
  xml: 'xml',
  docker: 'docker',
};

function buildLangIcon(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const info of bundledLanguagesInfo) {
    const icon = LANG_ICON_BY_ID[info.id];
    if (!icon) {
      continue;
    }

    map[info.id] = icon;
    for (const alias of info.aliases ?? []) {
      map[alias] = icon;
    }
  }

  return map;
}

export const langIcon = buildLangIcon();
