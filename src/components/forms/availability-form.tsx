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
    };

    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">{day}</h3>

            <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Times
                </div>                <div className="flex flex-col space-y-2">
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
                    label="Maximum Classes Per Day"
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
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Availability</h2>
                <button
                    onClick={handleReset}
                    className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    title="Reset only availability preferences"
                >
                    Reset
                </button>
            </div>

            {daysOfWeek.map((day) => (
                <AvailabilityDayForm key={day} day={day} />
            ))}
        </div>
    );
}
