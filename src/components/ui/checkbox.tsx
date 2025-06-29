import * as React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer" htmlFor={props.id}>
                    <div className="relative flex items-center">                        <input
                            type="checkbox"
                            ref={ref}                            className={cn(
                                'peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
                                className
                            )}
                            {...props}
                        />
                        <CheckIcon className="absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
                    </div>                    {label && (
                        <span className="text-sm font-medium text-gray-700">
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
