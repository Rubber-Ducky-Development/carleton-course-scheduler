'use client';

import { cn } from '@/lib/utils/cn';

export type Semester = 'fall' | 'winter';

interface SemesterToggleProps {
  currentSemester: Semester;
  onSemesterChange: (semester: Semester) => void;
  className?: string;
}

export function SemesterToggle({ currentSemester, onSemesterChange, className }: SemesterToggleProps) {
  return (
    <div className={cn("flex items-center space-x-1 bg-gray-100 rounded-lg p-1", className)}>
      <button
        onClick={() => onSemesterChange('fall')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          currentSemester === 'fall'
            ? "bg-white shadow-sm text-indigo-600 border border-indigo-100"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        )}
        aria-pressed={currentSemester === 'fall'}
      >
        Fall 2025
      </button>
      <button
        onClick={() => onSemesterChange('winter')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          currentSemester === 'winter'
            ? "bg-white shadow-sm text-indigo-600 border border-indigo-100"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        )}
        aria-pressed={currentSemester === 'winter'}
      >
        Winter 2026
      </button>
    </div>
  );
}
