// src/context/AccessibilityContext.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AccessibilityContext } from "./accessibilityContext";
import type { FontSize, Theme } from "./accessibilityContext";

const FONT_SIZES: FontSize[] = ["normal", "large", "xlarge"];
const FONT_SCALE: Record<FontSize, string> = {
    normal: "1",
    large: "1.2",
    xlarge: "1.45",
};

const isTheme = (value: string | null): value is Theme =>
    value === "light" || value === "dark";

const isFontSize = (value: string | null): value is FontSize =>
    value === "normal" || value === "large" || value === "xlarge";

function readStorage(key: string) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = readStorage("theme");
        return isTheme(stored) ? stored : "light";
    });
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        const stored = readStorage("fontSize");
        return isFontSize(stored) ? stored : "normal";
    });

    // 테마 적용
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        writeStorage("theme", theme);
    }, [theme]);

    // 글자 크기 적용
    useEffect(() => {
        document.documentElement.style.setProperty("--font-scale", FONT_SCALE[fontSize]);
        writeStorage("fontSize", fontSize);
    }, [fontSize]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    const increaseFontSize = useCallback(() => {
        setFontSize((prev) => {
            const idx = FONT_SIZES.indexOf(prev);
            return FONT_SIZES[(idx + 1) % FONT_SIZES.length];
        });
    }, []);

    const resetFontSize = useCallback(() => setFontSize("normal"), []);

    const value = useMemo(
        () => ({ theme, fontSize, toggleTheme, increaseFontSize, resetFontSize }),
        [theme, fontSize, toggleTheme, increaseFontSize, resetFontSize]
    );

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}
