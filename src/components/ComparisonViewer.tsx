'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, MoveHorizontal, RefreshCw, ZoomIn, Eye } from 'lucide-react';

interface ComparisonViewerProps {
  originalUrl: string;
  optimizedUrl: string;
  origDimensions?: { width: number; height: number };
  optDimensions?: { width: number; height: number };
  origSize?: number;
  optSize?: number;
  presetShortName?: string;
  isProcessing?: boolean;
  onKeyboardAction?: (key: string) => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 2 ? 1 : 0)}${sizes[i]}`;
}

export default function ComparisonViewer({
  originalUrl,
  optimizedUrl,
  origDimensions,
  optDimensions,
  origSize,
  optSize,
  presetShortName = 'FB HD',
  isProcessing = false,
  onKeyboardAction,
}: ComparisonViewerProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [isHoldingCanvas, setIsHoldingCanvas] = useState<boolean>(false);
  const [isPressingOriginal, setIsPressingOriginal] = useState<boolean>(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 150, y: 150 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });

  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Update slider position
  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Update touch position for loupe
  const updateTouchPos = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setTouchPos({ x, y });
  };

  // Pointer event handlers
  const onPointerDown = (e: React.PointerEvent) => {
    updateTouchPos(e.clientX, e.clientY);

    // If tapping near the slider line (+/- 30px), activate slider drag
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const sliderX = (sliderPosition / 100) * rect.width;

      if (Math.abs(clickX - sliderX) < 36 && !isLoupeActive) {
        setIsDraggingSlider(true);
        handleSliderMove(e.clientX);
        return;
      }
    }

    // Otherwise, touch-and-hold to activate loupe or if loupe is already toggled
    setIsHoldingCanvas(true);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    updateTouchPos(e.clientX, e.clientY);

    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  const onPointerUp = () => {
    setIsDraggingSlider(false);
    setIsHoldingCanvas(false);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPressingOriginal(true);
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsLoupeActive((prev) => !prev);
      } else if (onKeyboardAction) {
        onKeyboardAction(e.key.toLowerCase());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPressingOriginal(false);
      }
    };

    const handleGlobalPointerUp = () => {
      setIsDraggingSlider(false);
      setIsHoldingCanvas(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [onKeyboardAction]);

  const showLoupe = isLoupeActive || isHoldingCanvas;

  // Calculate loupe center: position 70px above finger
  const loupeRadius = 68; // 136px diameter
  const loupeCenterY = Math.max(loupeRadius + 10, touchPos.y - 70);
  const loupeCenterX = Math.max(loupeRadius + 10, Math.min(containerSize.width - loupeRadius - 10, touchPos.x));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none relative p-2 sm:p-3 overflow-hidden darkroom-grain">
      {/* Visual Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative w-full h-full max-h-full rounded overflow-hidden bg-[var(--color-paper)] flex items-center justify-center touch-none cursor-ew-resize border border-[var(--color-rule)]"
      >
        {/* Layer 1: Optimized Image (Right side) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimizedUrl}
          alt="Sau tối ưu"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Layer 2: Original Image (Left side) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none transition-none"
          style={{
            clipPath: isPressingOriginal
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Trước tối ưu"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Badges: Left (Original) & Right (Shielded) */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[var(--color-paper-hi)] text-[var(--color-muted)] border border-[var(--color-rule)] shadow-xs">
            Ảnh Gốc
          </span>
        </div>
        <div className="absolute top-3 right-3 pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-[var(--color-paper-hi)] text-[var(--color-accent)] border border-[var(--color-rule)] shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>Đã Bọc Khiên</span>
          </span>
        </div>

        {/* Quick Tools on Canvas (Toggle Loupe & Hold Original) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-auto z-15 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if ('vibrate' in navigator) navigator.vibrate(8);
              setIsLoupeActive(!isLoupeActive);
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 border transition-colors duration-150 ${
              isLoupeActive
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] border-[var(--color-accent)] font-semibold shadow-xs'
                : 'bg-[var(--color-paper-hi)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border-[var(--color-rule)] shadow-xs'
            }`}
            title="Kính lúp zoom 250% (Phím Z)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>250%</span>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              if ('vibrate' in navigator) navigator.vibrate(8);
              setIsPressingOriginal(true);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setIsPressingOriginal(false);
            }}
            onPointerLeave={() => setIsPressingOriginal(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 border transition-colors duration-150 ${
              isPressingOriginal
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] border-[var(--color-accent)] font-semibold shadow-xs'
                : 'bg-[var(--color-paper-hi)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border-[var(--color-rule)] shadow-xs'
            }`}
            title="Giữ để xem ảnh gốc (Phím Space)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Giữ xem Gốc</span>
          </button>
        </div>

        {/* Draggable Divider Line & Thumb Handle */}
        {!isPressingOriginal && (
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none transition-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-[var(--color-ink)]" />

            <div
              className={`absolute top-1/2 -left-4 sm:-left-5 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center slider-handle-precision pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-transform duration-100 ${
                isDraggingSlider ? 'scale-105' : ''
              }`}
            >
              <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-paper)]" />
            </div>
          </div>
        )}

        {/* 250% Touch-and-Hold Loupe (Offset -70px above contact point) */}
        {showLoupe && (
          <div
            className="absolute z-30 pointer-events-none w-34 h-34 sm:w-44 sm:h-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-ink)] loupe-ring overflow-hidden bg-[var(--color-paper)]"
            style={{
              left: `${loupeCenterX}px`,
              top: `${loupeCenterY}px`,
            }}
          >
            {/* Magnified Image Canvas (250% scale) */}
            <div
              className="absolute w-[250%] h-[250%] pointer-events-none origin-top-left"
              style={{
                left: `${-touchPos.x * 2.5 + (typeof window !== 'undefined' && window.innerWidth < 640 ? 68 : 88)}px`,
                top: `${-touchPos.y * 2.5 + (typeof window !== 'undefined' && window.innerWidth < 640 ? 68 : 88)}px`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isPressingOriginal ? originalUrl : optimizedUrl}
                alt="Loupe 250%"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Precision Hairline Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 border-t border-l border-[var(--color-ink)] -translate-x-0.5 -translate-y-0.5 opacity-80" />
              <div className="w-3 h-3 border-b border-r border-[var(--color-ink)] translate-x-0.5 translate-y-0.5 opacity-80" />
            </div>

            {/* Loupe Mode Pill */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[var(--color-paper-2)] text-[var(--color-accent)] text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-[var(--color-rule)] whitespace-nowrap shadow">
              2.5× {isPressingOriginal ? 'Gốc' : 'Nét L*'}
            </div>
          </div>
        )}

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-[var(--color-paper)]/75 z-40 flex flex-col items-center justify-center text-[var(--color-ink)] gap-2 animate-in fade-in duration-100 motion-reduce:animate-none">
            <RefreshCw className="w-6 h-6 text-[var(--color-accent)] animate-spin" />
            <span className="text-xs font-medium text-[var(--color-muted)]">Đang xử lý &amp; làm nét L*...</span>
          </div>
        )}

        {/* Technical Specs Leica Pill (At Bottom of Workspace) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[94%]">
          <div className="bg-[var(--color-paper-hi)] border border-[var(--color-rule)] px-3 py-1 rounded text-xs font-mono tabular-nums text-[var(--color-ink)] flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis shadow-xs">
            <span className="text-[var(--color-muted)]">
              Gốc: {origDimensions ? `${origDimensions.width}×${origDimensions.height}` : '...'} ({formatBytes(origSize)})
            </span>
            <span className="text-[var(--color-accent)] font-semibold">→</span>
            <span className="text-[var(--color-ink)] font-medium">
              {presetShortName}: {optDimensions ? `${optDimensions.width}×${optDimensions.height}` : '...'} ({formatBytes(optSize)})
            </span>
            <span className="hidden sm:inline text-[var(--color-muted)]">| Q92 4:4:4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
