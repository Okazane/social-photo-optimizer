'use client';

import React, { useState } from 'react';
import { PlatformKey, SharpenMode, FitStyle } from '@/types/optimizer';
import {
  Share2,
  RefreshCcw,
  Download,
  Copy,
  User,
  Mountain,
  MoreVertical,
  Crop,
  Smartphone,
  Maximize2,
  Square,
  Eye,
} from 'lucide-react';

interface BottomDockProps {
  platform: PlatformKey;
  onPlatformChange: (p: PlatformKey) => void;
  mode: SharpenMode;
  onModeChange: (m: SharpenMode) => void;
  fitStyle: FitStyle;
  onFitStyleChange: (f: FitStyle) => void;
  onFilesSelected: (files: File[]) => void;
  onSaveOrShare: () => void;
  onDownloadDirect: () => void;
  onCopyClipboard: () => void;
  isProcessing?: boolean;
}

export default function BottomDock({
  platform,
  onPlatformChange,
  mode,
  onModeChange,
  fitStyle,
  onFitStyleChange,
  onFilesSelected,
  onSaveOrShare,
  onDownloadDirect,
  onCopyClipboard,
  isProcessing = false,
}: BottomDockProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Normalize platform to one of the 3 primary keys for the dock
  const primaryPlatform: PlatformKey = 
    platform === 'ig_portrait' ? 'ig_feed' : 
    (platform === 'ig_story' || platform === 'fb_story') ? 'story' : 
    (platform === 'fb_portrait') ? 'fb_hd' : platform;

  const isIgOrStory = primaryPlatform === 'ig_feed' || primaryPlatform === 'story';

  const handlePlatformClick = (target: PlatformKey) => {
    if ('vibrate' in navigator) navigator.vibrate(8);
    onPlatformChange(target);
  };

  const handleModeClick = (target: SharpenMode) => {
    if ('vibrate' in navigator) navigator.vibrate(8);
    onModeChange(target);
  };

  const handleFitStyleClick = (target: FitStyle) => {
    if ('vibrate' in navigator) navigator.vibrate(8);
    onFitStyleChange(target);
  };

  return (
    <div className="w-full shrink-0 bg-[var(--color-paper-2)] border-t border-[var(--color-rule)] px-3.5 sm:px-6 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-30 select-none">
      <div className="max-w-2xl mx-auto space-y-2">
        {/* ROW 1: Platform Segmented Bar */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded bg-[var(--color-paper)] border border-[var(--color-rule)]">
          {/* Facebook HD */}
          <button
            type="button"
            onClick={() => handlePlatformClick('fb_hd')}
            className={`py-2 px-2 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 active:translate-y-px ${
              primaryPlatform === 'fb_hd'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Facebook HD</span>
          </button>

          {/* IG Feed 4:5 */}
          <button
            type="button"
            onClick={() => handlePlatformClick('ig_feed')}
            className={`py-2 px-2 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 active:translate-y-px ${
              primaryPlatform === 'ig_feed'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">IG Feed 4:5</span>
          </button>

          {/* Story / Reels */}
          <button
            type="button"
            onClick={() => handlePlatformClick('story')}
            className={`py-2 px-2 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 active:translate-y-px ${
              primaryPlatform === 'story'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Story 9:16</span>
          </button>
        </div>

        {/* ROW 2: Mode Segmented Bar */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded bg-[var(--color-paper)] border border-[var(--color-rule)]">
          {/* Chân dung */}
          <button
            type="button"
            onClick={() => handleModeClick('portrait')}
            className={`py-1.5 px-3 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 active:translate-y-px ${
              mode === 'portrait'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Chân dung</span>
          </button>

          {/* Phong cảnh */}
          <button
            type="button"
            onClick={() => handleModeClick('landscape')}
            className={`py-1.5 px-3 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 active:translate-y-px ${
              mode === 'landscape'
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Phong cảnh</span>
          </button>
        </div>

        {/* ROW 2.5: Progressive Disclosure - Framing Options */}
        {isIgOrStory && (
          <div className="grid grid-cols-4 gap-1 p-1 rounded bg-[var(--color-paper)] border border-[var(--color-rule)] animate-in fade-in duration-100 motion-reduce:animate-none">
            {/* 1. Cắt đầy (cover - ưu tiên số 1) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('cover')}
              className={`py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ${
                fitStyle === 'cover'
                  ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span className="whitespace-nowrap">Cắt đầy</span>
            </button>

            {/* 2. Viền đen (pad_black) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_black')}
              className={`py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ${
                fitStyle === 'pad_black'
                  ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Square className="w-3 h-3 fill-black text-[var(--color-rule)]" />
              <span className="whitespace-nowrap">Đen</span>
            </button>

            {/* 3. Viền trắng (pad_white) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_white')}
              className={`py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ${
                fitStyle === 'pad_white'
                  ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Square className="w-3 h-3 fill-white text-[var(--color-ink)]" />
              <span className="whitespace-nowrap">Trắng</span>
            </button>

            {/* 4. Nền mờ (pad_blur - sau cùng) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_blur')}
              className={`py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ${
                fitStyle === 'pad_blur'
                  ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] font-semibold border border-[var(--color-rule)] shadow-xs'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="whitespace-nowrap">Nền mờ</span>
            </button>
          </div>
        )}

        {/* ROW 3: Primary CTA & Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Nút 1: Đổi ảnh khác */}
          <label className="shrink-0 h-11 sm:h-12 px-3.5 sm:px-4 rounded bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)] text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule)] active:translate-y-px transition-colors duration-150 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onFilesSelected(Array.from(e.target.files));
                }
                e.target.value = '';
              }}
            />
            <RefreshCcw className="w-3.5 h-3.5 text-[var(--color-muted)]" />
            <span className="whitespace-nowrap">Đổi ảnh</span>
          </label>

          {/* Nút 2: Primary CTA - Amber Safelight Fill */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate([15, 40, 20]);
              onSaveOrShare();
            }}
            className="flex-1 h-11 sm:h-12 px-4 rounded bg-[var(--color-accent)] hover:brightness-105 text-[var(--color-accent-ink)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:translate-y-px transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate whitespace-nowrap">Lưu vào Album / Đăng ngay</span>
          </button>

          {/* Nút 3: More options (Copy, Download JPEG) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="h-11 sm:h-12 w-11 sm:w-12 rounded bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center justify-center border border-[var(--color-rule)] active:translate-y-px transition-colors duration-150"
              title="Tùy chọn tải thêm"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 bottom-full mb-1.5 w-52 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] p-1 z-50 text-xs shadow-md animate-in fade-in duration-100 motion-reduce:animate-none">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDownloadDirect();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2 text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors duration-150 text-left font-medium whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span>Tải trực tiếp JPEG</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onCopyClipboard();
                  }}
                  className="w-full px-3 py-2 rounded flex items-center gap-2 text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors duration-150 text-left font-medium whitespace-nowrap"
                >
                  <Copy className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                  <span>Sao chép ảnh (Clipboard)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
