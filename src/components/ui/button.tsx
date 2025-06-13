import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default:
                    'bg-peach-400 text-contrast hover:bg-peach-500 focus-visible:ring-peach-600',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-600',
                outline:
                    'bg-transparent border border-peach-300 text-contrast hover:bg-peach-100 focus-visible:ring-peach-400',
                secondary:
                    'bg-peach-200 text-contrast hover:bg-peach-300 focus-visible:ring-peach-400',
                ghost:
                    'bg-transparent hover:bg-peach-100 text-contrast hover:text-contrast focus-visible:ring-peach-400',
                link: 'bg-transparent underline-offset-4 hover:underline text-contrast hover:bg-transparent focus-visible:ring-peach-400',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                xl: 'h-12 px-10 rounded-md text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
