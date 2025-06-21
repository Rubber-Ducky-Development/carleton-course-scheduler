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
            background: `linear-gradient(to right, #6366f1 ${percentage}%, #e5e7eb ${percentage}%)`
        };

        return (
            <div className="w-full">                {label && (
                    <div className="flex items-center justify-between">
                        <label className="mb-1 block text-sm font-medium text-indigo-700">
                            {label}
                        </label>
                        {showValue && (
                            <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
                                {displayValue}
                            </span>
                        )}
                    </div>
                )}<input
                    type="range"
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    className={cn(
                        "h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200",
                        "appearance-none hover:opacity-80 transition-opacity",
                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                        "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-200",
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
