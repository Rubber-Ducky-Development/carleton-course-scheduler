'use client';

import { useSchedulerStore } from '@/lib/store/scheduler';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { DayOfWeek, TimeOfDay } from '@/lib/types/scheduler';

const timeOfDayOptions: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

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
                </div>
                <div className="flex flex-wrap gap-4">
                    {timeOfDayOptions.map((time) => (
                        <Checkbox
                            key={`${day}-${time}`}
                            id={`${day}-${time}`}
                            label={time}
                            checked={dayAvailability.availableTimes.includes(time)}
                            onChange={(e) => handleTimeChange(time, e.target.checked)}
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

    return (
        <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Daily Availability</h2>

            {daysOfWeek.map((day) => (
                <AvailabilityDayForm key={day} day={day} />
            ))}
        </div>
    );
}
