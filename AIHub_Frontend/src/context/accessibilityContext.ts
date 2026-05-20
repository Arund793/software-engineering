import { createContext } from "react";

export type Theme = "light" | "dark";
export type FontSize = "normal" | "large" | "xlarge";

export interface AccessibilityContextType {
    theme: Theme;
    fontSize: FontSize;
    toggleTheme: () => void;
    increaseFontSize: () => void;
    resetFontSize: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | null>(null);
