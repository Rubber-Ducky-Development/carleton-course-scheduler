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

// Export the component so it can be used directly
export function AvailabilityDayForm({ day }: AvailabilityDayProps) {
    const { preferences, updateDayAvailability, updateMaxClassesPerDay } = useSchedulerStore();

    const dayAvailability = preferences.dailyAvailability.find((d) => d.day === day);

    if (!dayAvailability) return null;    const handleTimeChange = (time: TimeOfDay, checked: boolean) => {
        let newTimes = [...dayAvailability.availableTimes];

        if (checked) {
            newTimes.push(time);
        } else {
            newTimes = newTimes.filter((t) => t !== time);
        }

        updateDayAvailability(day, newTimes);
        
        // If all time of day options are unchecked, set max classes to 0
        if (newTimes.length === 0) {
            updateMaxClassesPerDay(day, 0);
        } 
        // If the user just checked a box and max classes is currently 0, set it back to 7
        else if (checked && dayAvailability.maxClassesPerDay === 0) {
            updateMaxClassesPerDay(day, 7);
        }
    };return (
        <div>
            <h3 className="mb-2 font-medium text-indigo-700 text-lg">{day}</h3>
            
            <div className="mb-3">
                <div className="mb-1.5 text-sm font-medium text-gray-700">
                    Available Times
                </div>
                <div className="flex flex-col space-y-2 bg-purple-50/70 p-3 rounded-lg border border-purple-100/60">
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
            </div>            <div>
                <Slider
                    label="Maximum Classes"
                    min={0}
                    max={7}
                    step={1}
                    value={dayAvailability.maxClassesPerDay}
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        
                        // When slider is set to 0, uncheck all checkboxes
                        if (newValue === 0) {
                            updateDayAvailability(day, []);
                        } 
                        // If slider was 0 and is now being increased, re-enable all time slots
                        else if (dayAvailability.maxClassesPerDay === 0 && dayAvailability.availableTimes.length === 0) {
                            updateDayAvailability(day, ['Morning', 'Afternoon', 'Evening']);
                        }
                        
                        // Update the max classes value
                        updateMaxClassesPerDay(day, newValue);
                    }}
                    showValue={true}
                />
            </div>
        </div>
    );
}

export function AvailabilityForm() {
    // This component is now handled directly in the page layout
    // We keep it for backwards compatibility
    return null;
}
