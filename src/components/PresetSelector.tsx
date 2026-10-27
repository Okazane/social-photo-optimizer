'use client';

import React from 'react';
import { PlatformKey, SharpenMode, FitStyle, PRESETS_INFO } from '@/types/optimizer';
import { ShieldCheck, Crop, User, Mountain, Layers } from 'lucide-react';

interface PresetSelectorProps {
  platform: PlatformKey;
  onPlatformChange: (p: PlatformKey) => void;
  mode: SharpenMode;
  onModeChange: (m: SharpenMode) => void;
  fitStyle: FitStyle;
  onFitStyleChange: (f: FitStyle) => void;
  disabled?: boolean;
}

export default function PresetSelector({
  platform,
  onPlatformChange,
  mode,
  onModeChange,
  fitStyle,
  onFitStyleChange,
  disabled = false,
}: PresetSelectorProps) {
  const activeTab: 'facebook' | 'instagram' = PRESETS_INFO[platform]?.platform || 'facebook';

  const handleTabSwitch = (targetTab: 'facebook' | 'instagram') => {
    if (targetTab === 'facebook') {
      onPlatformChange('fb_hd');
    } else {
      onPlatformChange('ig_portrait');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Nền tảng: Facebook vs Instagram Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[var(--color-muted)]">
            Nền tảng tối ưu
          </label>
          <span className="text-[11px] font-mono tabular-nums text-[var(--color-accent)] bg-[var(--color-paper-2)] px-2 py-0.5 rounded border border-[var(--color-rule)]">
            {PRESETS_INFO[platform].dimensions}
          </span>
        </div>

        {/* Tab Switcher: Facebook & Instagram */}
        <div className="grid grid-cols-2 p-1 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleTabSwitch('facebook')}
            className={`py-2 px-3 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 ${
              activeTab === 'facebook'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleTabSwitch('instagram')}
            className={`py-2 px-3 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 ${
              activeTab === 'instagram'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <Crop className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Instagram</span>
          </button>
        </div>

        {/* Presets List */}
        {activeTab === 'facebook' ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_hd')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'fb_hd'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[var(--color-accent)] text-[var(--color-accent-ink)]">
                  Max 2048px
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Facebook HD</div>
              <div className="text-[10px] text-[var(--color-muted)]">Giữ nguyên khung</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_portrait')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'fb_portrait'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums bg-[var(--color-paper-2)] text-[var(--color-muted)] border border-[var(--color-rule)]">
                  4:5
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Facebook Dọc</div>
              <div className="text-[10px] text-[var(--color-muted)]">Tối đa newfeed</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_story')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'fb_story'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums bg-[var(--color-paper-2)] text-[var(--color-muted)] border border-[var(--color-rule)]">
                  9:16
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Facebook Story</div>
              <div className="text-[10px] text-[var(--color-muted)]">Màn hình dọc</div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_portrait')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'ig_portrait'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium">
                  4:5
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Instagram Dọc</div>
              <div className="text-[10px] text-[var(--color-muted)]">Chuẩn vàng Feed</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_square')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'ig_square'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums bg-[var(--color-paper-2)] text-[var(--color-muted)] border border-[var(--color-rule)]">
                  1:1
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Vuông Cổ Điển</div>
              <div className="text-[10px] text-[var(--color-muted)]">Lưới ảnh feed</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_story')}
              className={`p-3 rounded text-left border transition-colors duration-150 shadow-xs ${
                platform === 'ig_story'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums bg-[var(--color-paper)] text-[var(--color-muted)]">
                  9:16
                </span>
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Story / Reels</div>
              <div className="text-[10px] text-[var(--color-muted)]">Toàn màn hình</div>
            </button>
          </div>
        )}
      </div>

      {/* 2. Chọn Chế độ làm nét */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-muted)]">
          Chế độ làm nét
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange('portrait')}
            className={`p-3 rounded border text-left flex items-center gap-2.5 transition-colors duration-150 shadow-xs ${
              mode === 'portrait'
                ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <div className={`p-2 rounded shrink-0 ${mode === 'portrait' ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold' : 'bg-[var(--color-paper-2)] text-[var(--color-muted)]'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Chân dung</div>
              <div className="text-[10px] text-[var(--color-muted)] font-medium">Chi tiết chân dung</div>
            </div>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange('landscape')}
            className={`p-3 rounded border text-left flex items-center gap-2.5 transition-colors duration-150 shadow-xs ${
              mode === 'landscape'
                ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-ink)]'
                : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <div className={`p-2 rounded shrink-0 ${mode === 'landscape' ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold' : 'bg-[var(--color-paper-2)] text-[var(--color-muted)]'}`}>
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">Phong cảnh</div>
              <div className="text-[10px] text-[var(--color-muted)] font-medium">Chi tiết phong cảnh</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Tùy chọn Viền (Thứ tự ưu tiên: 1. Cắt đầy -> 2. Viền đen -> 3. Viền trắng -> 4. Nền mờ) */}
      {platform !== 'fb_hd' && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--color-muted)]">
            Khung viền ({PRESETS_INFO[platform].ratio})
          </label>

          <div className="grid grid-cols-4 gap-1.5">
            {/* 1. Cắt đầy */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('cover')}
              className={`p-2 rounded border text-center transition-colors duration-150 shadow-xs ${
                fitStyle === 'cover'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mx-auto mb-1 text-[var(--color-accent)]" />
              <div className="text-xs font-medium">Cắt đầy</div>
            </button>

            {/* 2. Viền đen */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('pad_black')}
              className={`p-2 rounded border text-center transition-colors duration-150 shadow-xs ${
                fitStyle === 'pad_black'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto mb-1 border border-[var(--color-rule)]" />
              <div className="text-xs font-medium">Viền Đen</div>
            </button>

            {/* 3. Viền trắng */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('pad_white')}
              className={`p-2 rounded border text-center transition-colors duration-150 shadow-xs ${
                fitStyle === 'pad_white' || fitStyle === 'original'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white mx-auto mb-1 border border-slate-400" />
              <div className="text-xs font-medium">Viền Trắng</div>
            </button>

            {/* 4. Nền mờ */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('pad_blur')}
              className={`p-2 rounded border text-center transition-colors duration-150 shadow-xs ${
                fitStyle === 'pad_blur'
                  ? 'bg-[var(--color-paper-hi)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                  : 'bg-[var(--color-paper-hi)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-paper-2)] border border-dashed border-[var(--color-rule-2)] mx-auto mb-1" />
              <div className="text-xs font-medium">Nền Mờ</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
