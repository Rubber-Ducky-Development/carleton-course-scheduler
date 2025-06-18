'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    forcedTheme?: Theme;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    forcedTheme,
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    
    const activeTheme = forcedTheme || theme;    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (activeTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(activeTheme);
    }, [activeTheme]);const value = {
        theme: forcedTheme || theme,
        setTheme: (theme: Theme) => {
            if (forcedTheme) return; // Don't allow theme changes if forcedTheme is set
            setTheme(theme);
            try {
                localStorage.setItem('theme', theme);
            } catch {
                // Handle localStorage errors
            }
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
