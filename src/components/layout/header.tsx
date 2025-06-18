'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { FeedbackDialog } from '@/components/layout/feedback-dialog';

export function Header() {
    return (        <header className="sticky top-0 z-10 border-b border-indigo-100 bg-[#f7f8fc]/90 backdrop-blur-sm shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        <span className="text-indigo-600">Termwise</span> | <span className="text-gray-700">Carleton Course Scheduler</span>
                    </h1>
                </div>

                <div className="flex items-center space-x-3">
                    <FeedbackDialog />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
