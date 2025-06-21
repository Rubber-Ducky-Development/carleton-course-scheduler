import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <label className="flex items-center space-x-2 cursor-pointer" htmlFor={props.id}>
          <div className="relative flex items-center">
            <input
              type="radio"
              ref={ref}
              className={cn(
                'peer h-4 w-4 appearance-none rounded-full border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
              {...props}
            />
            <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
          </div>
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
        </label>
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  className?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  name: string;
  onChange?: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  label?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, options, value, name, onChange, direction = 'vertical', label, ...props }, ref) => {
    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className={cn(
          'flex gap-4',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}>
          {options.map((option) => (
            <Radio
              key={option.value}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              label={option.label}
            />
          ))}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { Radio, RadioGroup };
