// src/components/layout/Header/Header.tsx
import { useRef, useState } from "react";
import s from "./Header.module.css";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function Header() {
    const { theme, fontSize, toggleTheme, increaseFontSize, resetFontSize } =
        useAccessibility();

    const goHome = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = "/";
    };

    const fontLabel =
        fontSize === "normal"
            ? "가 (보통)"
            : fontSize === "large"
            ? "가 (크게)"
            : "가 (매우 크게)";

    return (
        <header className={s.header}>
            <div className={s.inner}>
                {/* 브랜드 로고 */}
                <a href="/" className={s.brand} aria-label="AI Hub 홈" onClick={goHome}>
                    <img className={s.logo} src="/logo.png" alt="AI Hub 로고" />
                    <span className={s.text}>AI Hub</span>
                </a>

                {/* 접근성 버튼 그룹 */}
                <div className={s.controls} aria-label="접근성 컨트롤">
                    {/* 글자 크기 버튼 */}
                    <button
                        id="font-size-btn"
                        type="button"
                        className={s.accessBtn}
                        onClick={increaseFontSize}
                        title={`글자 크기 변경 (현재: ${fontLabel})`}
                        aria-label="글자 크기 키우기"
                    >
                        <span className={s.accessIcon} aria-hidden="true">가</span>
                        <span className={s.accessLabel}>{fontLabel}</span>
                    </button>

                    {/* 글자 크기 초기화 버튼 */}
                    {fontSize !== "normal" && (
                        <button
                            id="font-reset-btn"
                            type="button"
                            className={s.accessBtnSmall}
                            onClick={resetFontSize}
                            title="글자 크기 초기화"
                            aria-label="글자 크기 초기화"
                        >
                            초기화
                        </button>
                    )}

                    {/* 다크모드 토글 */}
                    <button
                        id="theme-toggle-btn"
                        type="button"
                        className={s.themeBtn}
                        onClick={toggleTheme}
                        title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
                        aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
                        aria-pressed={theme === "dark"}
                    >
                        <span aria-hidden="true">{theme === "light" ? "🌙" : "☀️"}</span>
                        <span className={s.accessLabel}>
                            {theme === "light" ? "다크 모드" : "라이트 모드"}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
