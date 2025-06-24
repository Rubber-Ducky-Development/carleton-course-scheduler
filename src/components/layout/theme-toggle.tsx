'use client';

import { useTheme } from '@/contexts/theme-context';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set light mode as default if no theme is set
    if (typeof window !== 'undefined' && !localStorage.getItem('theme')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Render a placeholder until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors">
        <div className="h-9 w-9 rounded-full bg-white shadow-md" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-0 shadow-inner ${
        isDark 
          ? 'bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg' 
          : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 shadow-md'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {/* Toggle circle */}
      <span
        className={`inline-block h-9 w-9 transform rounded-full bg-white transition-all duration-200 border border-gray-200 ${
          isDark ? 'translate-x-5 shadow-xl' : 'translate-x-0 shadow-md'
        }`}
      />
      {/* Light mode icon - visible when in light mode */}
      <span
        className={`absolute left-2 top-1.5 transition-opacity duration-200 ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-amber-400"
        >
          {/* Main sun circle - larger and more prominent */}
          <circle 
            cx="12" 
            cy="12" 
            r="6" 
            fill="currentColor"
            className="drop-shadow-sm"
          />
          {/* Inner highlight circle for depth */}
          <circle 
            cx="10.5" 
            cy="9.5" 
            r="1.5" 
            fill="white"
            opacity="0.3"
          />
          {/* Filled petal-like rays extending from the sun */}
          <ellipse cx="12" cy="3" rx="1.5" ry="2.5" fill="currentColor" />
          <ellipse cx="12" cy="21" rx="1.5" ry="2.5" fill="currentColor" />
          <ellipse cx="3" cy="12" rx="2.5" ry="1.5" fill="currentColor" />
          <ellipse cx="21" cy="12" rx="2.5" ry="1.5" fill="currentColor" />
          <ellipse cx="5.8" cy="5.8" rx="1.8" ry="1.8" fill="currentColor" transform="rotate(45 5.8 5.8)" />
          <ellipse cx="18.2" cy="18.2" rx="1.8" ry="1.8" fill="currentColor" transform="rotate(45 18.2 18.2)" />
          <ellipse cx="5.8" cy="18.2" rx="1.8" ry="1.8" fill="currentColor" transform="rotate(-45 5.8 18.2)" />
          <ellipse cx="18.2" cy="5.8" rx="1.8" ry="1.8" fill="currentColor" transform="rotate(-45 18.2 5.8)" />
        </svg>
      </span>
      {/* Dark mode icon - visible when in dark mode */}
      <span
        className={`absolute right-1.5 top-1.5 transition-opacity duration-200 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-indigo-300"
        >
          {/* Bubbly crescent moon */}
          <path
            d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
            fill="currentColor"
            className="drop-shadow-sm"
          />
        </svg>
      </span>
    </button>
  );
}
