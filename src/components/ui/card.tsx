import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    onRemove?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, onRemove, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative rounded-lg p-4 shadow-sm",
                    className
                )}
                {...props}
            >
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="absolute right-2 top-2 h-6 w-6 text-peach-700 hover:text-peach-900"
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

Card.displayName = 'Card';

export { Card };
