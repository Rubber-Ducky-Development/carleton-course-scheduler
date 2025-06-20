'use client';

import { useSchedulerStore } from '@/lib/store/scheduler';
import { BufferTime } from '@/lib/types/scheduler';
import { RadioGroup } from '@/components/ui/radio';

const bufferOptions = [
    { value: 'No Buffer', label: 'No Buffer' },
    { value: '30 Minutes', label: '30 Minutes' },
    { value: '1 Hour', label: '1 Hour' },
    { value: '1+ Hours', label: '1+ Hours' },
];

export function BufferTimeForm() {
    const { preferences, updateBufferTime } = useSchedulerStore();
    
    return (
        <div className="h-full">
            <h3 className="mb-2 font-medium text-indigo-700 text-lg">Buffer Time</h3>
              <div>
                <div className="mb-1.5 text-sm font-medium text-gray-700">
                    Buffer Time Between Classes
                </div>
                <div className="flex flex-col space-y-2 bg-purple-50/70 p-3 rounded-lg border border-purple-100/60">
                    <RadioGroup
                        options={bufferOptions}
                        value={preferences.bufferTime}
                        name="buffer-time"
                        onChange={(value) => updateBufferTime(value as BufferTime)}
                        direction="vertical"
                    />
                </div>
            </div>
        </div>
    );
}
