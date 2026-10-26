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
  Check,
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
    <div className="w-full shrink-0 dock-glass px-3.5 sm:px-6 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-30 select-none">
      <div className="max-w-2xl mx-auto space-y-2">
        {/* ROW 1: Platform Segmented Bar */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
          {/* Facebook HD */}
          <button
            type="button"
            onClick={() => handlePlatformClick('fb_hd')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-97 ${
              primaryPlatform === 'fb_hd'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📘</span>
            <span>Facebook HD</span>
          </button>

          {/* IG Feed 4:5 */}
          <button
            type="button"
            onClick={() => handlePlatformClick('ig_feed')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-97 ${
              primaryPlatform === 'ig_feed'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📸</span>
            <span>IG Feed 4:5</span>
          </button>

          {/* Story / Reels */}
          <button
            type="button"
            onClick={() => handlePlatformClick('story')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-97 ${
              primaryPlatform === 'story'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-1 ring-purple-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📱</span>
            <span>Story 9:16</span>
          </button>
        </div>

        {/* ROW 2: Mode Segmented Bar */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
          {/* Chân dung */}
          <button
            type="button"
            onClick={() => handleModeClick('portrait')}
            className={`py-1.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-97 ${
              mode === 'portrait'
                ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Chân dung</span>
          </button>

          {/* Phong cảnh */}
          <button
            type="button"
            onClick={() => handleModeClick('landscape')}
            className={`py-1.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-97 ${
              mode === 'landscape'
                ? 'bg-amber-600/90 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Phong cảnh</span>
          </button>
        </div>

        {/* ROW 2.5: Progressive Disclosure - IG / Story Framing Options */}
        {isIgOrStory && (
          <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-black/40 border border-white/[0.08] animate-in fade-in slide-in-from-top-1 duration-150">
            {/* 1. Cắt đầy (cover - ưu tiên số 1) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('cover')}
              className={`py-1 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                fitStyle === 'cover'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>✂️</span>
              <span>Cắt đầy</span>
            </button>

            {/* 2. Viền đen (pad_black) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_black')}
              className={`py-1 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                fitStyle === 'pad_black'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚫</span>
              <span>Đen</span>
            </button>

            {/* 3. Viền trắng (pad_white) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_white')}
              className={`py-1 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                fitStyle === 'pad_white'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚪</span>
              <span>Trắng</span>
            </button>

            {/* 4. Nền mờ (pad_blur - sau cùng) */}
            <button
              type="button"
              onClick={() => handleFitStyleClick('pad_blur')}
              className={`py-1 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                fitStyle === 'pad_blur'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌫️</span>
              <span>Nền mờ</span>
            </button>
          </div>
        )}

        {/* ROW 3: Primary CTA & Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Nút 1: Đổi ảnh khác (NATIVE LABEL: 100% mở album ảnh trực tiếp trên di động) */}
          <label className="shrink-0 h-11 sm:h-12 px-3.5 sm:px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all cursor-pointer">
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
            <RefreshCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Chọn</span>
            <span>Đổi ảnh</span>
          </label>

          {/* Nút 2: Primary CTA - Lưu vào Album / Đăng Ngay */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate([15, 40, 20]);
              onSaveOrShare();
            }}
            className="flex-1 h-11 sm:h-12 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 active:scale-98 transition-all disabled:opacity-50"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="truncate">Lưu vào Album / Đăng ngay</span>
          </button>

          {/* Nút 3: More options (Copy, Download JPEG) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="h-11 sm:h-12 w-11 sm:w-12 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 active:scale-95 transition-all"
              title="Tùy chọn tải thêm"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[#18181C] border border-white/10 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDownloadDirect();
                  }}
                  className="w-full px-3 py-2 rounded-xl flex items-center gap-2 text-slate-200 hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tải trực tiếp JPEG</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onCopyClipboard();
                  }}
                  className="w-full px-3 py-2 rounded-xl flex items-center gap-2 text-slate-200 hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
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
