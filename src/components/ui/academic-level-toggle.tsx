'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { TermLevel } from '@/lib/types/scheduler';

interface AcademicLevelToggleProps {
  currentLevel: TermLevel;
  onLevelChange: (level: TermLevel) => void;
  className?: string;
}

export function AcademicLevelToggle({ currentLevel, onLevelChange, className }: AcademicLevelToggleProps) {
  const undergradRef = useRef<HTMLButtonElement>(null);
  const graduateRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const undergradBtn = undergradRef.current;
    const graduateBtn = graduateRef.current;
    if (undergradBtn && graduateBtn) {
      const undergradRect = undergradBtn.getBoundingClientRect();
      const graduateRect = graduateBtn.getBoundingClientRect();
      const parentRect = undergradBtn.parentElement?.getBoundingClientRect();
      if (currentLevel === 'undergraduate') {
        setIndicatorStyle({
          left: undergradRect.left - (parentRect?.left || 0),
          width: undergradRect.width,
        });
      } else {
        setIndicatorStyle({
          left: graduateRect.left - (parentRect?.left || 0),
          width: graduateRect.width,
        });
      }
    }
  }, [currentLevel]);

  return (
    <div className={cn('flex items-center bg-[var(--toggle-bg)] rounded-lg min-h-[40px] p-1 relative overflow-hidden', className)}>
      <div
        style={{ left: indicatorStyle.left, width: indicatorStyle.width, margin: 0, padding: 0 }}
        className="absolute top-1 h-[calc(100%-8px)] bg-white shadow-sm border border-indigo-100 rounded-md transition-all duration-300 ease-in-out"
      />
      <button
        ref={undergradRef}
        onClick={() => onLevelChange('undergraduate')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
          currentLevel === 'undergraduate' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800',
        )}
        style={{ zIndex: 1 }}
        aria-pressed={currentLevel === 'undergraduate'}
      >
        Undergraduate
      </button>
      <button
        ref={graduateRef}
        onClick={() => onLevelChange('graduate')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
          currentLevel === 'graduate' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800',
        )}
        style={{ zIndex: 1 }}
        aria-pressed={currentLevel === 'graduate'}
      >
        Graduate
      </button>
    </div>
  );
}