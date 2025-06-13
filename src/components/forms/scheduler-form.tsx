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
                    className="w-full max-w-md bg-gradient-to-r from-peach-400 to-peach-dark-400 font-bold hover:from-peach-500 hover:to-peach-dark-500"
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate Schedule'}
                </Button>
            </div>
        </div>
    );
}
