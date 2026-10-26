'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Dropzone from '@/components/Dropzone';
import ComparisonViewer from '@/components/ComparisonViewer';
import BottomDock from '@/components/BottomDock';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import { PlatformKey, SharpenMode, FitStyle, DeviceProfile, ImageItem, PRESETS_INFO } from '@/types/optimizer';
import { copyImageToClipboard } from '@/utils/clipboard';
import { preflightPrepareImage } from '@/utils/preflightCheck';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'socialpic_darkroom_prefs_v1';

export default function Home() {
  // Config state (with sticky defaults)
  const [platform, setPlatform] = useState<PlatformKey>('fb_hd');
  const [mode, setMode] = useState<SharpenMode>('portrait');
  const [fitStyle, setFitStyle] = useState<FitStyle>('cover');
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile>('auto');
  const [detectedIsIos, setDetectedIsIos] = useState<boolean>(false);

  // Active image item state
  const [currentItem, setCurrentItem] = useState<ImageItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ref to cancel stale requests if user rapidly toggles options
  const abortControllerRef = useRef<AbortController | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Detect Device & Wide Gamut on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isIos = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setDetectedIsIos(isIos);

      // Restore saved preferences
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.platform) setPlatform(parsed.platform);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.fitStyle) setFitStyle(parsed.fitStyle);
          if (parsed.deviceProfile) setDeviceProfile(parsed.deviceProfile);
        }
      } catch {
        // Fallback to default
      }
    }
  }, []);

  // 2. Persist preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ platform, mode, fitStyle, deviceProfile })
      );
    } catch {
      // Ignore quota errors
    }
  }, [platform, mode, fitStyle, deviceProfile]);

  // 3. Core Optimization Function
  const runOptimization = useCallback(
    async (
      targetItem: ImageItem,
      currentPlatform: PlatformKey,
      currentMode: SharpenMode,
      currentFit: FitStyle,
      currentDevice: DeviceProfile
    ) => {
      // Cancel any ongoing optimization request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsProcessing(true);

      try {
        const { processedFile } = await preflightPrepareImage(targetItem.file);

        const formData = new FormData();
        formData.append('image', processedFile);
        formData.append('platform', currentPlatform);
        formData.append('mode', currentMode);
        formData.append('fitStyle', currentFit);
        formData.append('deviceProfile', currentDevice);

        const res = await fetch('/api/optimize', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Lỗi máy chủ (${res.status})`);
        }

        const blob = await res.blob();
        const optUrl = URL.createObjectURL(blob);

        const optWidth = Number(res.headers.get('x-opt-width')) || targetItem.origWidth;
        const optHeight = Number(res.headers.get('x-opt-height')) || targetItem.origHeight;
        const optSize = Number(res.headers.get('x-opt-size')) || blob.size;
        const iccProfile = decodeURIComponent(res.headers.get('x-icc-profile') || '');
        const colorAction = decodeURIComponent(res.headers.get('x-color-action') || '');
        const processTimeMs = Number(res.headers.get('x-process-time-ms')) || 0;

        setCurrentItem((prev) => {
          if (!prev || prev.id !== targetItem.id) return prev;
          if (prev.optUrl) URL.revokeObjectURL(prev.optUrl);
          return {
            ...prev,
            status: 'done',
            optBlob: blob,
            optUrl,
            optWidth,
            optHeight,
            optSize,
            iccProfile,
            colorAction,
            processTimeMs,
          };
        });
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Lỗi xử lý';
        showToast(`Lỗi: ${msg}`);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // 4. Handle New File Selection (Auto-Optimizes Immediately!)
  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // Active workflow focuses on single hero photo
    const origUrl = URL.createObjectURL(file);

    const newItem: ImageItem = {
      id: `${Date.now()}-${file.name}`,
      file,
      name: file.name,
      origUrl,
      origWidth: 0,
      origHeight: 0,
      origSize: file.size,
      status: 'idle',
    };

    // Read natural dimensions
    const img = new Image();
    img.onload = () => {
      newItem.origWidth = img.naturalWidth;
      newItem.origHeight = img.naturalHeight;
      setCurrentItem(newItem);
      // Trigger automatic optimization immediately!
      runOptimization(newItem, platform, mode, fitStyle, deviceProfile);
    };
    img.src = origUrl;
  };

  // 5. Reactive Re-optimization on preset change
  const handlePlatformChange = (newPlatform: PlatformKey) => {
    setPlatform(newPlatform);
    if (currentItem) {
      runOptimization(currentItem, newPlatform, mode, fitStyle, deviceProfile);
    }
  };

  const handleModeChange = (newMode: SharpenMode) => {
    setMode(newMode);
    if (currentItem) {
      runOptimization(currentItem, platform, newMode, fitStyle, deviceProfile);
    }
  };

  const handleFitStyleChange = (newFit: FitStyle) => {
    setFitStyle(newFit);
    if (currentItem) {
      runOptimization(currentItem, platform, mode, newFit, deviceProfile);
    }
  };

  const handleDeviceProfileChange = (newProfile: DeviceProfile) => {
    setDeviceProfile(newProfile);
    if (currentItem) {
      runOptimization(currentItem, platform, mode, fitStyle, newProfile);
    }
  };

  // 6. Action Handlers (Save to Album / Share / Download / Copy)
  const handleSaveOrShare = async () => {
    if (!currentItem?.optBlob) return;

    const file = new File([currentItem.optBlob], `shield-${currentItem.name}.jpg`, {
      type: 'image/jpeg',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Ảnh tối ưu bởi SocialPic Shield',
          text: 'Ảnh đã được bọc khiên chống nén và khóa chuẩn màu P3/sRGB.',
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
        });
        showToast('✓ Đã chia sẻ ảnh thành công!');
        return;
      } catch {
        // User dismissed share dialog
      }
    }

    // Fallback: Direct Download
    handleDownloadDirect();
  };

  const handleDownloadDirect = () => {
    if (!currentItem?.optUrl) return;
    const a = document.createElement('a');
    a.href = currentItem.optUrl;
    a.download = `shield-${platform}-${currentItem.name}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 },
    });
    showToast('✓ Đang tải ảnh về Album máy...');
  };

  const handleCopyClipboard = async () => {
    if (!currentItem?.optUrl) return;
    const ok = await copyImageToClipboard(currentItem.optUrl);
    if (ok) {
      if ('vibrate' in navigator) navigator.vibrate(12);
      showToast('✓ Đã sao chép ảnh vào Clipboard!');
    } else {
      showToast('Trình duyệt không hỗ trợ sao chép ảnh trực tiếp');
    }
  };

  // Keyboard shortcut actions dispatched from ComparisonViewer
  const handleKeyboardAction = (key: string) => {
    if (key === 's') {
      handleSaveOrShare();
    } else if (key === 'd') {
      handleDownloadDirect();
    } else if (key === 'c') {
      handleCopyClipboard();
    }
  };

  // Current preset short name for technical specs pill
  const presetShortName = PRESETS_INFO[platform]?.shortName || 'FB HD';

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-[#0A0A0C] text-slate-100 select-none">
      {/* 1. TOP BAR: Brand & Smart Device Profile Pill */}
      <Header
        deviceProfile={deviceProfile}
        detectedIsIos={detectedIsIos}
        onDeviceProfileChange={handleDeviceProfileChange}
      />

      {/* 2. WORKSPACE: 70% Area (No Page Scroll) */}
      <main className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        {!currentItem ? (
          /* Empty State: Center Dropzone with Native Photo Library Trigger */
          <Dropzone onFilesSelected={handleFilesSelected} />
        ) : (
          /* Active Image State: Comparison Split Slider + Loupe + Leica Monospace Specs */
          <ComparisonViewer
            originalUrl={currentItem.origUrl}
            optimizedUrl={currentItem.optUrl || currentItem.origUrl}
            origDimensions={{ width: currentItem.origWidth, height: currentItem.origHeight }}
            optDimensions={{ width: currentItem.optWidth || 0, height: currentItem.optHeight || 0 }}
            origSize={currentItem.origSize}
            optSize={currentItem.optSize}
            presetShortName={presetShortName}
            isProcessing={isProcessing}
            onKeyboardAction={handleKeyboardAction}
          />
        )}
      </main>

      {/* 3. CONTROL DOCK: Bottom 25-30% Thumb-Zone (Only visible when image loaded) */}
      {currentItem && (
        <BottomDock
          platform={platform}
          onPlatformChange={handlePlatformChange}
          mode={mode}
          onModeChange={handleModeChange}
          fitStyle={fitStyle}
          onFitStyleChange={handleFitStyleChange}
          onFilesSelected={handleFilesSelected}
          onSaveOrShare={handleSaveOrShare}
          onDownloadDirect={handleDownloadDirect}
          onCopyClipboard={handleCopyClipboard}
          isProcessing={isProcessing}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-[#18181C]/95 text-white text-xs font-semibold shadow-2xl border border-blue-500/40 backdrop-blur-md flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* PWA Prompt */}
      <PwaInstallPrompt />
    </div>
  );
}
