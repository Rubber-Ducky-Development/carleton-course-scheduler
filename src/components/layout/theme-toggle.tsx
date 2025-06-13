'use client';

import { useTheme } from '@/components/layout/theme-provider';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
            ) : (
                <SunIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
