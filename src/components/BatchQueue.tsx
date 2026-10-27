'use client';

import React from 'react';
import { ImageItem } from '@/types/optimizer';
import { Plus, X, Check, AlertCircle, RefreshCw, Archive, Play } from 'lucide-react';

interface BatchQueueProps {
  items: ImageItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onAddFiles: (files: File[]) => void;
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
  onAddFiles,
  isProcessingBatch,
  batchProgress,
  onStartBatch,
  onDownloadZip,
  disabled = false,
}: BatchQueueProps) {
  const pendingCount = items.filter((it) => it.status === 'idle' || it.status === 'error').length;
  const doneCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="w-full rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] p-3 space-y-3 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-ink)]">
            Hàng đợi tối ưu ({items.length} ảnh)
          </span>
          {doneCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-paper-3)] text-[var(--color-accent)] font-medium tabular-nums border border-[var(--color-rule)]">
              {doneCount}/{items.length} hoàn thành
            </span>
          )}
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-1.5">
          {pendingCount > 0 && (
            <button
              type="button"
              disabled={disabled || isProcessingBatch}
              onClick={onStartBatch}
              className="px-3 py-1.5 rounded bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold text-xs flex items-center gap-1.5 transition-colors duration-150 active:translate-y-px disabled:opacity-50"
            >
              {isProcessingBatch ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="whitespace-nowrap">Đang xử lý…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Xử lý tất cả ({pendingCount})</span>
                </>
              )}
            </button>
          )}

          {doneCount > 1 && (
            <button
              type="button"
              disabled={disabled || isProcessingBatch}
              onClick={onDownloadZip}
              className="px-3 py-1.5 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] font-medium text-xs flex items-center gap-1.5 hover:border-[var(--color-muted)] transition-colors duration-150 active:translate-y-px"
            >
              <Archive className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span className="whitespace-nowrap">Tải ZIP</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isProcessingBatch && (
        <div className="space-y-1.5 animate-in fade-in duration-100 motion-reduce:animate-none">
          <div className="flex justify-between text-[11px] text-[var(--color-muted)]">
            <span>{batchProgress.message}</span>
            <span className="font-mono tabular-nums text-[var(--color-accent)]">{batchProgress.percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--color-paper)] rounded overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)]"
              style={{ width: `${batchProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Thumbnails rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectIndex(idx)}
            className={`relative group shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer border transition-colors duration-150 ${
              activeIndex === idx
                ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                : 'border-[var(--color-rule)] hover:border-[var(--color-muted)] opacity-70 hover:opacity-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.optUrl || item.origUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {/* Status indicator */}
            <div className="absolute top-1 left-1">
              {item.status === 'done' && (
                <div className="w-4 h-4 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-accent)] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
              {item.status === 'processing' && (
                <div className="w-4 h-4 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-accent)] flex items-center justify-center">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                </div>
              )}
              {item.status === 'error' && (
                <div className="w-4 h-4 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-red-400 flex items-center justify-center">
                  <AlertCircle className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Remove button */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="absolute top-1 right-1 w-4 h-4 rounded bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* Add more button */}
        {!disabled && (
          <label className="shrink-0 w-16 h-16 rounded border border-dashed border-[var(--color-rule)] hover:border-[var(--color-accent)] flex flex-col items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer transition-colors duration-150">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onAddFiles(Array.from(e.target.files));
                }
                e.target.value = '';
              }}
            />
            <Plus className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="text-[10px] mt-0.5 font-medium">Thêm</span>
          </label>
        )}
      </div>
    </div>
  );
}
