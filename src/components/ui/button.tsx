import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default:
                    'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow',
                outline:
                    'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
                secondary:
                    'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-100',
                ghost:
                    'bg-transparent hover:bg-gray-50 text-gray-700',
                link: 'bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-700 hover:bg-transparent',
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
