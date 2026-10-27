'use client';

import React from 'react';
import { ImageItem, SharpenMode } from '@/types/optimizer';
import { ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';

interface TechInspectorProps {
  item: ImageItem;
  mode: SharpenMode;
}

export default function TechInspector({ item, mode }: TechInspectorProps) {
  return (
    <div className="w-full rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] p-3 text-xs select-none">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--color-rule)]">
        <div className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>Thông số kiểm định</span>
        </div>
        <span className="text-[10px] text-[var(--color-muted)]">
          libvips • MozJPEG
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[var(--color-paper)] p-2 rounded border border-[var(--color-rule)]">
          <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Không gian màu</span>
          <span className="font-medium text-[var(--color-ink)] block truncate">
            {item.iccProfile || 'sRGB IEC61966-2.1'}
          </span>
          <span className="text-[10px] text-[var(--color-muted)] block mt-0.5">
            Bảo tồn dải màu
          </span>
        </div>

        <div className="bg-[var(--color-paper)] p-2 rounded border border-[var(--color-rule)]">
          <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Nội suy kích thước</span>
          <span className="font-medium text-[var(--color-ink)] block">
            Lanczos3 Sinc
          </span>
          <span className="text-[10px] text-[var(--color-muted)] block mt-0.5 tabular-nums">
            {item.optWidth}×{item.optHeight} px
          </span>
        </div>

        <div className="bg-[var(--color-paper)] p-2 rounded border border-[var(--color-rule)]">
          <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Chống nén kép</span>
          <span className="font-medium text-[var(--color-accent)] block">
            MozJPEG Q92
          </span>
          <span className="text-[10px] text-[var(--color-muted)] block mt-0.5">
            Chroma 4:4:4
          </span>
        </div>

        <div className="bg-[var(--color-paper)] p-2 rounded border border-[var(--color-rule)]">
          <span className="text-[10px] text-[var(--color-muted)] block mb-0.5">Độ nét Luminance</span>
          <span className="font-medium text-[var(--color-ink)] block">
            {mode === 'portrait' ? 'Nét Dịu Chân Dung' : 'Nét Sâu Chi Tiết'}
          </span>
          <span className="text-[10px] text-[var(--color-muted)] block mt-0.5 font-mono tabular-nums">
            {item.processTimeMs ? `${item.processTimeMs}ms` : '4:4:4'}
          </span>
        </div>
      </div>
    </div>
  );
}
