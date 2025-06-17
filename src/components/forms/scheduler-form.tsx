'use client';

import { Button } from '@/components/ui/button';
import { useSchedulerStore } from '@/lib/store/scheduler';

export function SchedulerForm() {
    const { generateSchedule, isGenerating } = useSchedulerStore();

    return (
        <div>
            <div className="flex justify-center mb-6">
                <Button
                    onClick={generateSchedule}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate Schedule'}
                </Button>
            </div>
        </div>
    );
}
