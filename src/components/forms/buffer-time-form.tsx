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

    return (        <div className="mb-6">
            <div className="p-4 rounded-xl border border-gray-100 bg-[#fcfcfc] shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
                <Select
                    label="Buffer Time Between Classes"
                    options={bufferOptions}
                    value={preferences.bufferTime}
                    onChange={(e) => updateBufferTime(e.target.value as BufferTime)}
                    className="mb-2"
                />
                <p className="text-sm text-gray-600 italic">
                    Select how much time you want between your classes
                </p>
            </div>
        </div>
    );
}
