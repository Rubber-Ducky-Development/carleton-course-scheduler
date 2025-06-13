'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function SchedulerForm() {
    const { addCourse, generateSchedule, isGenerating } = useSchedulerStore();
    const { courses } = useSchedulerStore((state) => state.preferences);

    return (
        <div>
            <div className="mb-6 flex justify-center">
                <Button
                    onClick={addCourse}
                    variant="outline"
                    className="w-full max-w-md"
                    disabled={courses.length >= 7} // Max 7 courses as per requirements
                >
                    Add Another Course
                </Button>
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={generateSchedule}
                    size="lg"
                    className="w-full max-w-md bg-gradient-to-r from-primary-600 to-secondary-600 font-bold hover:from-primary-700 hover:to-secondary-700"
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate Schedule'}
                </Button>
            </div>
        </div>
    );
}
