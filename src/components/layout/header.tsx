'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { FeedbackDialog } from '@/components/layout/feedback-dialog';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function Header() {
    const { currentSemester } = useSchedulerStore();

    return (<header className="sticky top-0 z-10 border-b border-indigo-100 bg-[#f7f8fc]/90 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-0 lg:px-8">                <div className="flex items-center min-w-0 flex-1">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center leading-tight">
                <div className="flex items-center">
                    <span className="text-indigo-600">Termwise</span>
                    <span className="hidden sm:inline mx-2 text-gray-400">|</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center mt-0.5 sm:mt-0">
                    <span className="text-gray-700 text-xs sm:text-base md:text-xl leading-tight">
                        Carleton Course Scheduler
                    </span>
                    <span className="hidden md:inline mx-2 text-gray-400">•</span>
                    <span className="text-indigo-500 text-xs sm:text-sm md:text-base font-medium mt-0.5 sm:mt-0">
                        {currentSemester === 'fall' ? 'Fall 2025' : 'Winter 2026'}
                    </span>
                </div>
            </h1>
        </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <FeedbackDialog />
                <ThemeToggle />
            </div>
        </div>
    </header>
    );
}