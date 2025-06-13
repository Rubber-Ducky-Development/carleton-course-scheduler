'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';

export function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Course Scheduler
                    </h1>
                </div>

                <div className="flex items-center">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
