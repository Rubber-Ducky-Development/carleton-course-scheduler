'use client';

/**
 * This file is simplified to just be a wrapper for its children
 * All theme-related functionality has been removed
 */

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: string; // Kept for API compatibility
    forcedTheme?: string; // Kept for API compatibility
};

export function ThemeProvider({
    children,
}: ThemeProviderProps) {
    return <>{children}</>;
}
