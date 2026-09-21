"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
type ThemeContextValue = {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (t: Theme) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "theme";
function readStored(): Theme {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === "dark" || raw === "light") return raw;
    } catch {}
    return "system";
}
function systemPrefersDark(): boolean {
    try {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
        return false;
    }
}

function readResolvedFromDom(): ResolvedTheme {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function apply(resolved: ResolvedTheme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
}
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(readResolvedFromDom);
    useEffect(() => {
        const stored = readStored();
        setThemeState(stored);
        const resolved: ResolvedTheme =
            stored === "system" ? (systemPrefersDark() ? "dark" : "light") : stored;
        setResolvedTheme(resolved);
    }, []);
    useEffect(() => {
        if (theme !== "system") return;
        let mql: MediaQueryList;
        try {
            mql = window.matchMedia("(prefers-color-scheme: dark)");
        } catch {
            return;
        }
        const handler = () => {
            const next: ResolvedTheme = mql.matches ? "dark" : "light";
            setResolvedTheme(next);
            apply(next);
        };
        mql.addEventListener?.("change", handler);
        return () => mql.removeEventListener?.("change", handler);
    }, [theme]);
    const setTheme = useCallback((next: Theme) => {
        try {
            if (next === "system") localStorage.removeItem(STORAGE_KEY);
            else localStorage.setItem(STORAGE_KEY, next);
        } catch {}
        const resolved: ResolvedTheme =
            next === "system" ? (systemPrefersDark() ? "dark" : "light") : next;
        setThemeState(next);
        setResolvedTheme(resolved);
        apply(resolved);
    }, []);
    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}
