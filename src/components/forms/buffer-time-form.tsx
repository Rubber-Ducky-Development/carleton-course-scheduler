'use client';

import { useSchedulerStore } from '@/lib/store/scheduler';
import { Select } from '@/components/ui/select';
import { BufferTime } from '@/lib/types/scheduler';

const bufferOptions = [
    { value: 'No Buffer', label: 'No Buffer' },
    { value: '30 Minutes', label: '30 Minutes' },
    { value: '1 Hour', label: '1 Hour' },
    { value: '1+ Hours', label: '1+ Hours' },
];

export function BufferTimeForm() {
    const { preferences, updateBufferTime } = useSchedulerStore();

    return (
        <div className="mb-6">
            <Select
                label="Buffer Time Between Classes"
                options={bufferOptions}
                value={preferences.bufferTime}
                onChange={(e) => updateBufferTime(e.target.value as BufferTime)}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select how much time you want between your classes
            </p>
        </div>
    );
}
