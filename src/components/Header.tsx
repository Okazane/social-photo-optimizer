'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown, Check, Smartphone, Monitor } from 'lucide-react';
import { DeviceProfile } from '@/types/optimizer';

interface HeaderProps {
  deviceProfile: DeviceProfile;
  detectedIsIos: boolean;
  onDeviceProfileChange: (profile: DeviceProfile) => void;
}

export default function Header({
  deviceProfile,
  detectedIsIos,
  onDeviceProfileChange,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Compute label and color styling for badge
  const isCurrentlyP3 = deviceProfile === 'iphone' || (deviceProfile === 'auto' && detectedIsIos);

  return (
    <header className="w-full shrink-0 h-13 border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-xl z-30 select-none">
      <div className="max-w-6xl mx-auto px-3.5 h-full flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
            SocialPic
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Shield
            </span>
          </span>
        </div>

        {/* Device Profile Pill with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all border ${
              isCurrentlyP3
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Nhấp để thay đổi chế độ nhận diện thiết bị"
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
            <span>
              {deviceProfile === 'auto' ? (
                detectedIsIos ? '✨ Tự động: 🍏 iPhone (P3)' : '✨ Tự động: 🤖 Android (sRGB)'
              ) : deviceProfile === 'iphone' ? (
                '🍏 Chuẩn iPhone (P3)'
              ) : (
                '🤖 Chuẩn Android (sRGB)'
              )}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-[#18181C] border border-white/10 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Khóa chuẩn màu &amp; Thẻ ICC
              </div>

              {/* Option 1: Auto */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('auto');
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                  deviceProfile === 'auto'
                    ? 'bg-blue-600/20 text-blue-400 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <div>Tự động nhận diện</div>
                    <div className="text-[10px] text-slate-400">
                      {detectedIsIos ? 'Phát hiện iPhone (Display P3)' : 'Phát hiện Android / Web (sRGB)'}
                    </div>
                  </div>
                </div>
                {deviceProfile === 'auto' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              {/* Option 2: iPhone P3 */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('iphone');
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                  deviceProfile === 'iphone'
                    ? 'bg-emerald-600/20 text-emerald-400 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🍏</span>
                  <div>
                    <div>Chuẩn iPhone (Display P3)</div>
                    <div className="text-[10px] text-emerald-400/80">Bảo tồn 100% màu rộng OLED</div>
                  </div>
                </div>
                {deviceProfile === 'iphone' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              {/* Option 3: Android sRGB */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('android');
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                  deviceProfile === 'android'
                    ? 'bg-amber-600/20 text-amber-400 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🤖</span>
                  <div>
                    <div>Chuẩn Android (sRGB)</div>
                    <div className="text-[10px] text-amber-400/80">LittleCMS IEC61966-2.1</div>
                  </div>
                </div>
                {deviceProfile === 'android' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
