'use client';

import { useSchedulerStore } from '@/lib/store/scheduler';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { DayOfWeek, TimeOfDay } from '@/lib/types/scheduler';

const timeOfDayOptions: { value: TimeOfDay; label: string; timeFrame: string }[] = [
    { value: 'Morning', label: 'Morning', timeFrame: '(8:00 AM - 12:00 PM)' },
    { value: 'Afternoon', label: 'Afternoon', timeFrame: '(12:00 PM - 5:00 PM)' },
    { value: 'Evening', label: 'Evening', timeFrame: '(5:00 PM - 10:00 PM)' }
];

interface AvailabilityDayProps {
    day: DayOfWeek;
}

export function AvailabilityDayForm({ day }: AvailabilityDayProps) {
    const { preferences, updateDayAvailability, updateMaxClassesPerDay } = useSchedulerStore();

    const dayAvailability = preferences.dailyAvailability.find((d) => d.day === day);

    if (!dayAvailability) return null;

    const handleTimeChange = (time: TimeOfDay, checked: boolean) => {
        let newTimes = [...dayAvailability.availableTimes];

        if (checked) {
            newTimes.push(time);
        } else {
            newTimes = newTimes.filter((t) => t !== time);
        }

        updateDayAvailability(day, newTimes);
    };    return (        <div className="mb-4 rounded-xl border border-gray-100 bg-[#fcfcfd] p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-200 course-card">
            <h3 className="mb-2 font-medium text-indigo-700">{day}</h3>            <div className="mb-3">
                <div className="mb-1.5 text-sm font-medium text-gray-700">
                    Available Times
                </div>
                <div className="flex flex-col space-y-2 bg-purple-50/70 p-2.5 rounded-lg border border-purple-100/60">
                    {timeOfDayOptions.map((timeOption) => (
                        <Checkbox
                            key={`${day}-${timeOption.value}`}
                            id={`${day}-${timeOption.value}`}
                            label={`${timeOption.label} ${timeOption.timeFrame}`}
                            checked={dayAvailability.availableTimes.includes(timeOption.value)}
                            onChange={(e) => handleTimeChange(timeOption.value, e.target.checked)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <Slider
                    label="Maximum Classes"
                    min={0}
                    max={5}
                    step={1}
                    value={dayAvailability.maxClassesPerDay}
                    onChange={(e) => updateMaxClassesPerDay(day, Number(e.target.value))}
                    showValue={true}
                />
            </div>
        </div>
    );
}

export function AvailabilityForm() {
    const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const { resetAvailabilityPreferences } = useSchedulerStore();

    const handleReset = () => {
        if (window.confirm('Reset availability preferences to default values?')) {
            resetAvailabilityPreferences();
        }
    };    return (
        <div>            <div className="flex justify-between items-center mb-3">
                <button
                    onClick={handleReset}
                    className="text-xs px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
                    title="Reset only availability preferences"
                >
                    Reset All to Available
                </button>
            </div>            <div className="grid gap-3">
                {daysOfWeek.map((day) => (
                    <AvailabilityDayForm key={day} day={day} />
                ))}
            </div>
        </div>
    );
}
