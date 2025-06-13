import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's className merging
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
