import * as React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div>
                <label className="flex items-center cursor-pointer">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            ref={ref}
                            className={cn(
                                'peer h-4 w-4 cursor-pointer appearance-none rounded border border-peach-400 bg-peach-50 checked:border-peach-700 checked:bg-peach-700 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
                                className
                            )}
                            id={props.id}
                            {...props}
                        />
                        <CheckIcon className="absolute left-0 top-0 h-4 w-4 text-contrast-light opacity-0 pointer-events-none peer-checked:opacity-100" />
                    </div>
                    {label && (
                        <span className="ml-2 text-sm font-medium text-contrast">
                            {label}
                        </span>
                    )}
                </label>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
