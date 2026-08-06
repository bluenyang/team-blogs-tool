import toc from 'comark/plugins/toc';
import highlight from '@comark/nuxt/plugins/highlight';
import oneDarkPro from '@shikijs/themes/one-dark-pro';
import { shikiLangList } from '~/constants/shiki-lang-list';
import unwrapImages from '~/utils/comark-unwrap-images';

export const comarkPlugins = [
  unwrapImages(),
  toc(),
  highlight({
    themes: {
      light: oneDarkPro,
      dark: oneDarkPro,
    },
    languages: shikiLangList,
  }),
];
