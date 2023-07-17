import React, { createContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface ThemeProps {
    children?: React.ReactNode,
}

type Palette = "light" | "dark";
export type ThemePalette = Palette | "system";

export const ThemeContext = createContext<{ theme: ThemePalette, setTheme: (value: ThemePalette) => void, isSystemDarkTheme: boolean, isDark: boolean }>({
    setTheme: () => {},
    theme: 'light',
    isSystemDarkTheme: false,
    isDark: false,
});

export const ThemeProvider: React.FC<ThemeProps> = ({ children }) => {

    const systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [isSystemDarkTheme, setIsSystemDarkTheme] = useState(systemThemeIsDark);

    const {
        storedValue: theme,
        setStorageValue: setTheme,
    } = useLocalStorage<ThemePalette>('theme', systemThemeIsDark ? 'dark' : 'light');

    const themeChangeListener = ((e: any) => {
        setIsSystemDarkTheme(e.matches);
    });

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addEventListener('change', themeChangeListener);
        return () => darkThemeMq.removeEventListener('change', themeChangeListener);
    }, []);

    const isThemeDark = theme === 'dark' || (theme === 'system' && isSystemDarkTheme);

    useEffect(() => {
        if (isThemeDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isThemeDark]);

    return (
        <ThemeContext.Provider value={{ theme: theme || 'light', setTheme, isSystemDarkTheme, isDark: isThemeDark }}>
            {children}
        </ThemeContext.Provider>
    );
}
