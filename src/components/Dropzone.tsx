'use client';

import React, { useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Clipboard, Camera, Plus, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function Dropzone({ onFilesSelected, disabled = false }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles: File[] = [];

    for (let i = 0; i < Math.min(fileList.length, 10); i++) {
      const file = fileList[i];
      if (
        file.type.startsWith('image/') ||
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif')
      ) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      if ('vibrate' in navigator) navigator.vibrate(10);
      onFilesSelected(validFiles);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handlePasteClick = async () => {
    try {
      setIsPasting(true);
      const clipboardItems = await navigator.clipboard.read();
      const files: File[] = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            files.push(new File([blob], `pasted-${Date.now()}.${type.split('/')[1] || 'jpg'}`, { type }));
          }
        }
      }

      if (files.length > 0) {
        if ('vibrate' in navigator) navigator.vibrate(10);
        onFilesSelected(files);
      }
    } catch {
      // Fallback
    } finally {
      setIsPasting(false);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) pastedFiles.push(blob);
        }
      }
      if (pastedFiles.length > 0) {
        if ('vibrate' in navigator) navigator.vibrate(10);
        onFilesSelected(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, onFilesSelected]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full max-w-lg aspect-square sm:aspect-[4/3] max-h-[70vh] rounded border border-dashed transition-colors duration-150 p-6 sm:p-10 text-center flex flex-col items-center justify-center cursor-pointer group ${
          isDragOver
            ? 'border-[var(--color-accent)] bg-[var(--color-paper-2)]'
            : 'border-[var(--color-rule-2)] hover:border-[var(--color-accent)] bg-[var(--color-paper-hi)] shadow-sm'
        }`}
      >
        {/* Full-card Invisible Input */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple
          aria-label="Tải ảnh lên"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        {/* Hero Icon */}
        <div className="relative mb-4 z-10 pointer-events-none">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded border border-[var(--color-rule)] bg-[var(--color-paper)] flex items-center justify-center text-[var(--color-accent)] transition-transform duration-150 group-hover:scale-105">
            <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)] flex items-center justify-center font-bold text-xs shadow">
            <Plus className="w-3 h-3" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-base sm:text-lg font-semibold text-[var(--color-ink)] mb-1 tracking-tight z-10 pointer-events-none">
          {isDragOver ? 'Thả ảnh vào đây' : 'Chọn hoặc kéo thả ảnh cần tối ưu'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-muted)] mb-5 max-w-xs z-10 pointer-events-none">
          Khóa chuẩn màu Display P3 / sRGB và làm nét L* cho Facebook, Instagram
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-2 z-10">
          {/* Nút 1: Thư Viện Ảnh (NATIVE LABEL) - Amber Safelight Accent */}
          <label className="w-full min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-accent)] hover:brightness-105 text-[var(--color-accent-ink)] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:translate-y-px transition-colors duration-150 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <ImageIcon className="w-4 h-4" />
            <span className="whitespace-nowrap">Mở thư viện ảnh</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* Nút 2: Dán Clipboard */}
            <button
              type="button"
              onClick={handlePasteClick}
              className="min-h-[40px] px-3 py-2 rounded bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium text-xs flex items-center justify-center gap-1.5 border border-[var(--color-rule)] active:translate-y-px transition-colors duration-150"
            >
              <Clipboard className="w-3.5 h-3.5 text-[var(--color-muted)]" />
              <span className="whitespace-nowrap">{isPasting ? 'Đang đọc...' : 'Dán ảnh (Ctrl+V)'}</span>
            </button>

            {/* Nút 3: Camera */}
            <label className="min-h-[40px] px-3 py-2 rounded bg-[var(--color-paper)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)] font-medium text-xs flex items-center justify-center gap-1.5 border border-[var(--color-rule)] active:translate-y-px transition-colors duration-150 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <Camera className="w-3.5 h-3.5 text-[var(--color-muted)]" />
              <span className="whitespace-nowrap">Chụp ảnh mới</span>
            </label>
          </div>
        </div>

        {/* Feature technical specs */}
        <div className="mt-5 flex items-center justify-center divide-x divide-[var(--color-rule)] text-[11px] text-[var(--color-muted)] z-10 pointer-events-none">
          <span className="px-2.5">Display P3 / sRGB</span>
          <span className="px-2.5">Lanczos3 Sinc</span>
          <span className="px-2.5">MozJPEG 4:4:4</span>
        </div>
      </div>
    </div>
  );
}
