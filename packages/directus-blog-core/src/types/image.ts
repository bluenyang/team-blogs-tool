export interface ImageQuery {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  quality?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
}
