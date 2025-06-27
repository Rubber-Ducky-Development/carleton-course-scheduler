'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export type Semester = 'fall' | 'winter';

interface SemesterToggleProps {
  currentSemester: Semester;
  onSemesterChange: (semester: Semester) => void;
  className?: string;
}

export function SemesterToggle({ currentSemester, onSemesterChange, className }: SemesterToggleProps) {
  const fallRef = useRef<HTMLButtonElement>(null);
  const winterRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const fallBtn = fallRef.current;
    const winterBtn = winterRef.current;
    if (fallBtn && winterBtn) {
      const fallRect = fallBtn.getBoundingClientRect();
      const winterRect = winterBtn.getBoundingClientRect();
      const parentRect = fallBtn.parentElement?.getBoundingClientRect();
      if (currentSemester === 'fall') {
        setIndicatorStyle({
          left: fallRect.left - (parentRect?.left || 0),
          width: fallRect.width,
        });
      } else {
        setIndicatorStyle({
          left: winterRect.left - (parentRect?.left || 0),
          width: winterRect.width,
        });
      }
    }
  }, [currentSemester]);

  return (
        <div className={cn("flex items-center bg-[var(--toggle-bg)] rounded-lg min-h-[40px] p-1 relative overflow-hidden", className)}>

      {/* Animated background slider */}
      <div
        style={{ left: indicatorStyle.left, width: indicatorStyle.width, margin: 0, padding: 0 }}
        className={cn(
          "absolute top-1 h-[calc(100%-8px)] bg-white shadow-sm border border-indigo-100 rounded-md transition-all duration-300 ease-in-out"
        )}
      />
      <button
        ref={fallRef}
        onClick={() => onSemesterChange('fall')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative z-10",
          currentSemester === 'fall'
            ? "text-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        )}
        aria-pressed={currentSemester === 'fall'}
      >
        Fall 2025
      </button>
      <button
        ref={winterRef}
        onClick={() => onSemesterChange('winter')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative z-10",
          currentSemester === 'winter'
            ? "text-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        )}
        aria-pressed={currentSemester === 'winter'}
      >
        Winter 2026
      </button>
    </div>
  );
}
