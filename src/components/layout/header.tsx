'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { FeedbackDialog } from '@/components/layout/feedback-dialog';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function Header() {
    const { currentSemester } = useSchedulerStore();
    
    return (        <header className="sticky top-0 z-10 border-b border-indigo-100 bg-[#f7f8fc]/90 backdrop-blur-sm shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">                <div className="flex items-center">
                    <h1 className="text-lg md:text-xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center">
                        <span className="text-indigo-600">Termwise</span>
                        <span className="hidden sm:inline mx-2">|</span>
                        <span className="text-gray-700 text-sm sm:text-base md:text-xl">
                            Carleton Course Scheduler
                        </span>
                        <span className="hidden md:inline mx-2 text-gray-400">•</span>
                        <span className="text-indigo-500 text-xs sm:text-sm md:text-base font-medium">
                            {currentSemester === 'fall' ? 'Fall 2024' : 'Winter 2025'}
                        </span>
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