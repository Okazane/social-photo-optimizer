'use client';

import React from 'react';
import { ImageItem } from '@/types/optimizer';
import { CheckCircle2, Loader2, AlertCircle, Trash2, Plus, Sparkles, Archive } from 'lucide-react';

interface BatchQueueProps {
  items: ImageItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onAddMore?: () => void;
  onAddFiles?: (files: File[]) => void;
  isProcessingBatch: boolean;
  batchProgress: { current: number; total: number; percent: number; message: string };
  onStartBatch: () => void;
  onDownloadZip: () => void;
  disabled?: boolean;
}

export default function BatchQueue({
  items,
  activeIndex,
  onSelectIndex,
  onRemoveItem,
  onAddMore,
  onAddFiles,
  isProcessingBatch,
  batchProgress,
  onStartBatch,
  onDownloadZip,
  disabled = false,
}: BatchQueueProps) {
  const completedCount = items.filter((it) => it.status === 'done').length;
  const pendingCount = items.filter((it) => it.status === 'idle' || it.status === 'error').length;

  return (
    <div className="w-full glass-panel rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-extrabold text-white">
            Hàng đợi ảnh ({items.length})
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
            {completedCount}/{items.length} hoàn thành
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 && !isProcessingBatch && (
            <button
              type="button"
              onClick={onStartBatch}
              disabled={disabled}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bọc khiên tất cả ({pendingCount})</span>
            </button>
          )}

          {completedCount > 1 && !isProcessingBatch && (
            <button
              type="button"
              onClick={onDownloadZip}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Tải trọn bộ ZIP</span>
            </button>
          )}

          {/* Native Label for Adding More Photos (100% reliable on iOS & Android) */}
          <label
            className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1 cursor-pointer ${
              disabled || isProcessingBatch ? 'opacity-50 pointer-events-none' : ''
            }`}
            title="Thêm ảnh khác vào hàng đợi"
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              className="sr-only"
              disabled={disabled || isProcessingBatch}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  if (onAddFiles) {
                    onAddFiles(Array.from(e.target.files));
                  } else if (onAddMore) {
                    onAddMore();
                  }
                  e.target.value = '';
                }
              }}
            />
            <Plus className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Thêm ảnh</span>
          </label>
        </div>
      </div>

      {/* Dynamic Progress Indicator */}
      {isProcessingBatch && (
        <div className="space-y-2 bg-slate-900/95 p-3.5 rounded-2xl border border-blue-500/40 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              {batchProgress.message || 'Đang bọc khiên chống nén...'}
            </span>
            <span className="font-mono text-slate-200">
              {batchProgress.current}/{batchProgress.total} ({batchProgress.percent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${batchProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Horizontal Thumbnails Tray */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
        {items.map((item, index) => {
          const isSelected = activeIndex === index;
          return (
            <div
              key={item.id}
              onClick={() => onSelectIndex(index)}
              className={`relative group shrink-0 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 ring-4 ring-blue-500/25 scale-105 shadow-xl shadow-blue-500/20'
                  : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.optUrl || item.origUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-1.5 right-1.5 pointer-events-none">
                {item.status === 'done' && (
                  <div className="bg-emerald-500 text-slate-950 rounded-full p-1 shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 font-bold" />
                  </div>
                )}
                {item.status === 'processing' && (
                  <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg animate-spin">
                    <Loader2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="bg-rose-500 text-white rounded-full p-1 shadow-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Number tag */}
              <div className="absolute bottom-1.5 left-1.5 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-slate-200">
                #{index + 1}
              </div>

              {/* Remove button on hover */}
              {!isProcessingBatch && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-opacity shadow-md"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
