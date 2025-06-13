import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, min = 0, max = 100, step = 1, showValue = false, valueFormatter, ...props }, ref) => {
        const [value, setValue] = React.useState<number>(props.value ? Number(props.value) : min);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = Number(e.target.value);
            setValue(newValue);
            if (props.onChange) {
                props.onChange(e);
            }
        };

        React.useEffect(() => {
            if (props.value !== undefined) {
                setValue(Number(props.value));
            }
        }, [props.value]);

        const displayValue = valueFormatter ? valueFormatter(value as number) : value;
        
        // Calculate the percentage for slider background fill
        const percentage = ((value - min) / (max - min)) * 100;
        const backgroundStyle = {
            background: `linear-gradient(to right, #2563eb ${percentage}%, #e5e7eb ${percentage}%)`
        };

        return (
            <div className="w-full">
                {label && (
                    <div className="flex items-center justify-between">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                        </label>
                        {showValue && (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {displayValue}
                            </span>
                        )}
                    </div>
                )}
                <input
                    type="range"
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    className={cn(
                        "h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700",
                        "appearance-none",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-webkit-slider-thumb]:shadow-md",
                        "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:dark:bg-blue-500 [&::-moz-range-thumb]:border-none",
                        "focus:outline-none focus:ring-0",
                        className
                    )}
                    style={backgroundStyle}
                    {...props}
                />
            </div>
        );
    }
);

Slider.displayName = 'Slider';

export { Slider };
