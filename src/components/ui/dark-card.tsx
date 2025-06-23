import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
    onRemove?: () => void;
}

const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
    ({ className, children, onRemove, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-lg transition-all hover:shadow-xl hover:border-purple-600 text-gray-100",
                    className
                )}
                {...props}
            >
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-gray-300"
                        type="button"
                    >
                        <XMarkIcon className="h-4 w-4" />
                        <span className="sr-only">Remove card</span>
                    </Button>
                )}
                {children}
            </div>
        );
    }
);

DarkCard.displayName = 'DarkCard';

export { DarkCard };
