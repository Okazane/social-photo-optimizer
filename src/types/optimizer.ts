export type PlatformKey = 
  | 'fb_hd' 
  | 'ig_feed'
  | 'story'
  | 'fb_portrait' 
  | 'fb_story'
  | 'ig_portrait' 
  | 'ig_square' 
  | 'ig_story';

export type SharpenMode = 'portrait' | 'landscape';
export type FitStyle = 'pad_blur' | 'cover' | 'pad_white' | 'pad_black' | 'original';
export type DeviceProfile = 'auto' | 'iphone' | 'android';

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  origUrl: string;
  origWidth: number;
  origHeight: number;
  origSize: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  optUrl?: string;
  optBlob?: Blob;
  optWidth?: number;
  optHeight?: number;
  optSize?: number;
  iccProfile?: string;
  colorAction?: string;
  processTimeMs?: number;
  errorMessage?: string;
}

export interface PresetInfo {
  id: PlatformKey;
  platform: 'facebook' | 'instagram';
  name: string;
  shortName: string;
  tag: string;
  ratio: string;
  dimensions: string;
}

export const PRESETS_INFO: Record<PlatformKey, PresetInfo> = {
  // --- PRIMARY COCKPIT PRESETS ---
  fb_hd: {
    id: 'fb_hd',
    platform: 'facebook',
    name: 'Facebook HD',
    shortName: 'FB HD',
    tag: 'Khung gốc',
    ratio: 'Gốc',
    dimensions: 'Max 2048px',
  },
  ig_feed: {
    id: 'ig_feed',
    platform: 'instagram',
    name: 'IG Feed 4:5',
    shortName: 'IG 4:5',
    tag: 'Chuẩn Feed',
    ratio: '4:5',
    dimensions: '1080 × 1350 px',
  },
  story: {
    id: 'story',
    platform: 'instagram',
    name: 'Story / Reels',
    shortName: 'Story',
    tag: 'Màn hình dọc',
    ratio: '9:16',
    dimensions: '1080 × 1920 px',
  },

  // --- COMPATIBILITY PRESETS ---
  ig_portrait: {
    id: 'ig_portrait',
    platform: 'instagram',
    name: 'Instagram Dọc',
    shortName: 'IG 4:5',
    tag: 'Chuẩn Feed',
    ratio: '4:5',
    dimensions: '1080 × 1350 px',
  },
  ig_square: {
    id: 'ig_square',
    platform: 'instagram',
    name: 'Instagram Vuông',
    shortName: 'IG 1:1',
    tag: 'Lưới ảnh',
    ratio: '1:1',
    dimensions: '1080 × 1080 px',
  },
  ig_story: {
    id: 'ig_story',
    platform: 'instagram',
    name: 'Instagram Story',
    shortName: 'IG Story',
    tag: 'Toàn màn hình',
    ratio: '9:16',
    dimensions: '1080 × 1920 px',
  },
  fb_portrait: {
    id: 'fb_portrait',
    platform: 'facebook',
    name: 'Facebook Dọc',
    shortName: 'FB 4:5',
    tag: 'Tối đa Feed',
    ratio: '4:5',
    dimensions: '1638 × 2048 px',
  },
  fb_story: {
    id: 'fb_story',
    platform: 'facebook',
    name: 'Facebook Story',
    shortName: 'FB Story',
    tag: 'Màn hình dọc',
    ratio: '9:16',
    dimensions: '1080 × 1920 px',
  },
};
