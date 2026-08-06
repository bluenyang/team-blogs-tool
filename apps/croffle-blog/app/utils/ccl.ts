import type { BlogSetting } from '@croffledev/directus-blog-core';

export function getCclLicenseCode(settings?: BlogSetting): string {
  if (!settings?.allowCCL) return '';
  const parts = ['CC', 'BY'];
  if (!settings.allowCommercial) parts.push('NC');
  if (settings.changeContent === 'share_alike') parts.push('SA');
  if (settings.changeContent === 'no_derivative') parts.push('ND');
  return parts.join(' ');
}

export function getCclCommercialLabel(settings?: BlogSetting): string {
  if (!settings?.allowCCL) return '';
  return settings.allowCommercial ? '상업적 이용 허용' : '상업적 이용 불가 (NonCommercial)';
}

export function getCclChangeLabel(settings?: BlogSetting): string {
  if (!settings?.allowCCL) return '';
  switch (settings.changeContent) {
    case 'share_alike':
      return '변경 허용 · 동일 라이선스 유지 (ShareAlike)';
    case 'no_derivative':
      return '변경 금지 (NoDerivatives)';
    case 'allow':
    default:
      return '변경 허용';
  }
}

export function getCclCreativeCommonsUrl(settings?: BlogSetting): string | null {
  const code = getCclLicenseCode(settings).toLowerCase().replaceAll(' ', '-');
  if (!code) return null;
  // e.g. cc-by-nc-sa → https://creativecommons.org/licenses/by-nc-sa/4.0/
  const path = code.replace(/^cc-/, '');
  return `https://creativecommons.org/licenses/${path}/4.0/`;
}
