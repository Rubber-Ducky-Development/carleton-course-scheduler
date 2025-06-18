'use client';

import { Button } from '@/components/ui/button';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function SchedulerForm() {
    const { generateSchedule, isGenerating } = useSchedulerStore();    return (
        <div>
            <Button
                onClick={generateSchedule}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-500 font-bold hover:from-indigo-700 hover:to-violet-600 shadow-md hover:shadow-lg transition-all rounded-xl py-6"
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating...' : 'Generate Schedule'}
            </Button>
        </div>
    );
}
