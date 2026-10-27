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

  const isCurrentlyP3 = deviceProfile === 'iphone' || (deviceProfile === 'auto' && detectedIsIos);

  return (
    <header className="w-full shrink-0 h-13 border-b border-[var(--color-rule)] bg-[var(--color-paper)] z-30 select-none">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded border border-[var(--color-rule)] bg-[var(--color-paper-hi)] flex items-center justify-center text-[var(--color-accent)] shadow-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-[var(--color-ink)] flex items-center gap-1.5">
            <span>SocialPic</span>
            <span className="text-[var(--color-accent)] font-medium">Shield</span>
          </span>
        </div>

        {/* Device Profile Pill with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-2 border transition-colors duration-150 ${
              isCurrentlyP3
                ? 'bg-[var(--color-paper-hi)] text-[var(--color-accent)] border-[var(--color-rule-2)] hover:border-[var(--color-accent)] shadow-xs'
                : 'bg-[var(--color-paper-hi)] text-[var(--color-ink)] border-[var(--color-rule)] hover:border-[var(--color-muted)] shadow-xs'
            }`}
            title="Thay đổi chuẩn màu thẻ ảnh"
          >
            <Smartphone className="w-3 h-3 text-[var(--color-accent)]" />
            <span className="tabular-nums">
              {deviceProfile === 'auto' ? (
                detectedIsIos ? 'Tự động: iPhone (P3)' : 'Tự động: Android (sRGB)'
              ) : deviceProfile === 'iphone' ? (
                'iPhone (Display P3)'
              ) : (
                'Android (sRGB)'
              )}
            </span>
            <ChevronDown className={`w-3 h-3 text-[var(--color-muted)] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 rounded bg-[var(--color-paper-hi)] border border-[var(--color-rule-2)] p-1 z-50 text-xs shadow-md animate-in fade-in duration-100 motion-reduce:animate-none">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--color-muted)] border-b border-[var(--color-rule)] mb-1">
                Chuẩn màu &amp; Thẻ ICC
              </div>

              {/* Option 1: Auto */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('auto');
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded flex items-center justify-between text-left transition-colors duration-150 whitespace-nowrap ${
                  deviceProfile === 'auto'
                    ? 'bg-[var(--color-paper-2)] text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <div>
                    <div>Tự động nhận diện</div>
                    <div className="text-[11px] text-[var(--color-muted)]">
                      {detectedIsIos ? 'Khóa Display P3 (Apple)' : 'Khóa sRGB IEC61966-2.1'}
                    </div>
                  </div>
                </div>
                {deviceProfile === 'auto' && <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
              </button>

              {/* Option 2: iPhone P3 */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('iphone');
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded flex items-center justify-between text-left transition-colors duration-150 whitespace-nowrap ${
                  deviceProfile === 'iphone'
                    ? 'bg-[var(--color-paper-2)] text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <div>
                    <div>Chuẩn iPhone (Display P3)</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Bảo toàn 100% màu rộng OLED</div>
                  </div>
                </div>
                {deviceProfile === 'iphone' && <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
              </button>

              {/* Option 3: Android sRGB */}
              <button
                type="button"
                onClick={() => {
                  onDeviceProfileChange('android');
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded flex items-center justify-between text-left transition-colors duration-150 whitespace-nowrap ${
                  deviceProfile === 'android'
                    ? 'bg-[var(--color-paper-2)] text-[var(--color-accent)] font-semibold'
                    : 'text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                  <div>
                    <div>Chuẩn Android (sRGB)</div>
                    <div className="text-[11px] text-[var(--color-muted)]">Quy đổi LittleCMS sRGB</div>
                  </div>
                </div>
                {deviceProfile === 'android' && <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
