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
        className={`relative w-full max-w-lg aspect-square sm:aspect-[4/3] max-h-[70vh] rounded-3xl border-2 border-dashed transition-all duration-200 p-6 sm:p-10 text-center flex flex-col items-center justify-center cursor-pointer group ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01] shadow-2xl shadow-blue-500/20'
            : 'border-white/10 hover:border-white/20 bg-[#121216]/60 hover:bg-[#121216]'
        }`}
      >
        {/* Full-card Invisible Input: Tapping anywhere triggers native library picker */}
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md border-2 border-[#121216]">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-base sm:text-xl font-extrabold text-white mb-1 tracking-tight z-10 pointer-events-none">
          {isDragOver ? 'Thả ảnh vào đây' : 'Chạm để chọn hoặc kéo thả ảnh'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-xs z-10 pointer-events-none">
          Khóa chuẩn màu OLED &amp; làm nét L* chống nén khi đăng Facebook, Instagram
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-2 z-10">
          {/* Nút 1: Thư Viện Ảnh (NATIVE LABEL) */}
          <label className="w-full min-h-[46px] px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 transition-all cursor-pointer">
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
            <span>Mở Thư Viện Ảnh</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {/* Nút 2: Dán Clipboard */}
            <button
              type="button"
              onClick={handlePasteClick}
              className="min-h-[42px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 active:scale-98 transition-all"
            >
              <Clipboard className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPasting ? 'Đang đọc...' : 'Dán ảnh (Ctrl+V)'}</span>
            </button>

            {/* Nút 3: Camera */}
            <label className="min-h-[42px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 active:scale-98 transition-all cursor-pointer">
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
              <Camera className="w-3.5 h-3.5 text-pink-400" />
              <span>Chụp ảnh mới</span>
            </label>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono z-10 pointer-events-none">
          <span className="flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            Display P3 / sRGB Lock
          </span>
          <span>•</span>
          <span>Lanczos3 Sinc</span>
          <span>•</span>
          <span>MozJPEG 4:4:4</span>
        </div>
      </div>
    </div>
  );
}
