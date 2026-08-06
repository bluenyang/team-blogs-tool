export interface BlogSetting {
  allowCCL: boolean;
  allowCommercial?: boolean;
  changeContent?: 'allow' | 'share_alike' | 'no_derivative';
  licenseNote?: string;
}
