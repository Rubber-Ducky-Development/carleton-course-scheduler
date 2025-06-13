'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';

export function Header() {
    return (
        <header className="sticky top-0 z-10 border-b border-peach-300 bg-peach">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-contrast">
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
