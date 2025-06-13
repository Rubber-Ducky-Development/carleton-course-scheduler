'use client';

import { Button } from '@/components/ui/button';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function SchedulerForm() {
    const { generateSchedule, isGenerating } = useSchedulerStore();

    return (
        <div>
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
