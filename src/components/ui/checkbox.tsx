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
                                'peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-primary-500 checked:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900',
                                className
                            )}
                            id={props.id}
                            {...props}
                        />
                        <CheckIcon className="absolute left-0 top-0 h-4 w-4 text-white opacity-0 pointer-events-none peer-checked:opacity-100" />
                    </div>
                    {label && (
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
