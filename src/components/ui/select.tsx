import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1 block text-sm font-medium text-peach-700">
                        {label}
                    </label>
                )}
                <select
                    className={cn(
                        "flex h-10 w-full rounded-md border border-peach-400 bg-peach-50 px-3 py-2 text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
