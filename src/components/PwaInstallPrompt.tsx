'use client';

import React, { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration error:', err);
      });
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 motion-reduce:animate-none">
      <div className="p-3.5 rounded bg-[var(--color-paper-hi)] border border-[var(--color-rule-2)] flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-ink)]">Cài đặt ứng dụng PicShield</h4>
            <p className="text-[11px] text-[var(--color-muted)] leading-tight">
              Mở toàn màn hình không thanh trình duyệt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold text-xs active:translate-y-px transition-colors duration-150"
          >
            Cài đặt
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
