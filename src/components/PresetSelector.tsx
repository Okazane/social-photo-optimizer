'use client';

import React, { useState } from 'react';
import { PlatformKey, SharpenMode, FitStyle, PRESETS_INFO } from '@/types/optimizer';
import { ShieldCheck, Crop, Smartphone, Square, User, Mountain, Layers } from 'lucide-react';

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
  // Determine current active platform tab
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
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Nền tảng tối ưu
          </label>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-semibold">
            {PRESETS_INFO[platform].dimensions}
          </span>
        </div>

        {/* Tab Switcher: Facebook & Instagram */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleTabSwitch('facebook')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleTabSwitch('instagram')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'instagram'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25 ring-1 ring-pink-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crop className="w-4 h-4 text-pink-300" />
            <span>Instagram</span>
          </button>
        </div>

        {/* Presets List based on Active Tab */}
        {activeTab === 'facebook' ? (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-200">
            {/* Facebook HD */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_hd')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'fb_hd'
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-500 text-white">
                  Max 2048px
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Facebook HD</div>
              <div className="text-[10px] text-slate-400">Giữ nguyên khung</div>
            </button>

            {/* Facebook Portrait 4:5 */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_portrait')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'fb_portrait'
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                  4:5
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Facebook Dọc</div>
              <div className="text-[10px] text-slate-400">Tối đa newfeed</div>
            </button>

            {/* Facebook Story */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('fb_story')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'fb_story'
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                  9:16
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Facebook Story</div>
              <div className="text-[10px] text-slate-400">Màn hình dọc</div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-200">
            {/* Instagram Portrait 4:5 */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_portrait')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'ig_portrait'
                  ? 'bg-pink-600/20 border-pink-500 text-white ring-1 ring-pink-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-pink-500 text-white font-bold">
                  4:5
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Instagram Dọc</div>
              <div className="text-[10px] text-slate-400">Chuẩn vàng Feed</div>
            </button>

            {/* Instagram Square 1:1 */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_square')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'ig_square'
                  ? 'bg-pink-600/20 border-pink-500 text-white ring-1 ring-pink-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                  1:1
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Vuông Cổ Điển</div>
              <div className="text-[10px] text-slate-400">Lưới ảnh feed</div>
            </button>

            {/* Instagram Story / Reels */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPlatformChange('ig_story')}
              className={`p-3 rounded-2xl text-left border transition-all ${
                platform === 'ig_story'
                  ? 'bg-pink-600/20 border-pink-500 text-white ring-1 ring-pink-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                  9:16
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm">Story / Reels</div>
              <div className="text-[10px] text-slate-400">Toàn màn hình</div>
            </button>
          </div>
        )}
      </div>

      {/* 2. Chọn Chế độ làm nét */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Chế độ làm nét
        </label>

        <div className="grid grid-cols-2 gap-2">
          {/* Chân dung */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange('portrait')}
            className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
              mode === 'portrait'
                ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${mode === 'portrait' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">Chân Dung / Đời Thường</div>
              <div className="text-[10px] text-emerald-400 font-medium">Mịn da • Nét mắt &amp; tóc</div>
            </div>
          </button>

          {/* Phong cảnh */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange('landscape')}
            className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
              mode === 'landscape'
                ? 'bg-amber-600/20 border-amber-500 text-white ring-1 ring-amber-500/40'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${mode === 'landscape' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">Phong Cảnh / Đồ Ăn</div>
              <div className="text-[10px] text-amber-400 font-medium">Nét sâu chi tiết</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Tùy chọn Viền (chỉ hiện khi chọn khung cố định khác fb_hd) */}
      {platform !== 'fb_hd' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Khung viền ({PRESETS_INFO[platform].ratio})
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('pad_white')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                fitStyle === 'pad_white' || fitStyle === 'original'
                  ? 'bg-violet-600/25 border-violet-500 text-white font-bold ring-1 ring-violet-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white mx-auto mb-1 border border-slate-400" />
              <div className="text-xs font-semibold">Viền Trắng</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('pad_black')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                fitStyle === 'pad_black'
                  ? 'bg-violet-600/25 border-violet-500 text-white font-bold ring-1 ring-violet-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 mx-auto mb-1 border border-slate-700" />
              <div className="text-xs font-semibold">Viền Đen</div>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onFitStyleChange('cover')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                fitStyle === 'cover'
                  ? 'bg-violet-600/25 border-violet-500 text-white font-bold ring-1 ring-violet-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mx-auto mb-1 text-slate-300" />
              <div className="text-xs font-semibold">Cắt Vừa Khung</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
