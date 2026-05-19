// src/context/AccessibilityContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type FontSize = "normal" | "large" | "xlarge";

interface AccessibilityContextType {
    theme: Theme;
    fontSize: FontSize;
    toggleTheme: () => void;
    increaseFontSize: () => void;
    resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const FONT_SIZES: FontSize[] = ["normal", "large", "xlarge"];
const FONT_SCALE: Record<FontSize, string> = {
    normal: "1",
    large: "1.2",
    xlarge: "1.45",
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem("theme") as Theme) ?? "light";
    });
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        return (localStorage.getItem("fontSize") as FontSize) ?? "normal";
    });

    // 테마 적용
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // 글자 크기 적용
    useEffect(() => {
        document.documentElement.style.setProperty("--font-scale", FONT_SCALE[fontSize]);
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

    const increaseFontSize = () => {
        setFontSize((prev) => {
            const idx = FONT_SIZES.indexOf(prev);
            return FONT_SIZES[(idx + 1) % FONT_SIZES.length];
        });
    };

    const resetFontSize = () => setFontSize("normal");

    return (
        <AccessibilityContext.Provider
            value={{ theme, fontSize, toggleTheme, increaseFontSize, resetFontSize }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
    return ctx;
}
