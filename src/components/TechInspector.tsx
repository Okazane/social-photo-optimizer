'use client';

import React from 'react';
import { ImageItem, SharpenMode } from '@/types/optimizer';
import { ShieldCheck } from 'lucide-react';

interface TechInspectorProps {
  item: ImageItem;
  mode: SharpenMode;
}

export default function TechInspector({ item, mode }: TechInspectorProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const origSizeStr = formatBytes(item.origSize);
  const optSizeStr = item.optSize ? formatBytes(item.optSize) : '--';
  const sizeDiff = item.optSize && item.origSize 
    ? Math.round(((item.origSize - item.optSize) / item.origSize) * 100) 
    : 0;

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg overflow-hidden">
      {/* 4 Quick Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Kích thước</span>
          <span className="font-mono text-slate-300">
            {item.origWidth}×{item.origHeight}
          </span>
          <span className="text-[11px] text-blue-400 font-mono font-bold block mt-0.5">
            → {item.optWidth}×{item.optHeight}
          </span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Dung lượng</span>
          <span className="font-mono text-slate-300">
            {origSizeStr}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono font-bold block mt-0.5">
            → {optSizeStr} {sizeDiff > 0 && `(-${sizeDiff}%)`}
          </span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Không gian màu</span>
          <span className="font-semibold text-amber-300 truncate block">
            {item.iccProfile?.split('(')[0] || 'Display P3'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Khóa màu 100%
          </span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-0.5">Độ nét Luminance</span>
          <span className="font-semibold text-teal-300 block">
            {mode === 'portrait' ? 'Nét Dịu Chân Dung' : 'Nét Sâu Chi Tiết'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            {item.processTimeMs ? `${item.processTimeMs}ms • 4:4:4` : 'Chroma 4:4:4'}
          </span>
        </div>
      </div>
    </div>
  );
}
