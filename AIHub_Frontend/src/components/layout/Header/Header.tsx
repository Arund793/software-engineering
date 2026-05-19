// src/components/layout/Header/Header.tsx
import { Link } from "react-router-dom";
import s from "./Header.module.css";
import { useAccessibility } from "@/context/useAccessibility";

export default function Header() {
    const { theme, fontSize, toggleTheme, increaseFontSize, resetFontSize } =
        useAccessibility();

    return (
        <header className={s.header}>
            <div className={s.inner}>
                {/* 브랜드 로고 */}
                <Link to="/" className={s.brand} aria-label="AI Hub 홈">
                    <img className={s.logo} src="/logo.png" alt="AI Hub 로고" />
                    <span className={s.text}>AI Hub</span>
                </Link>

                {/* 접근성 버튼 그룹 */}
                <div className={s.controls} aria-label="접근성 컨트롤">
                    {/* 글자 크기 버튼 */}
                    <button
                        id="font-size-btn"
                        type="button"
                        className={s.accessBtn}
                        onClick={increaseFontSize}
                        title="쉬운UI"
                        aria-label="쉬운UI"
                    >
                        <span className={s.accessIcon} aria-hidden="true">가</span>
                        <span className={s.accessLabel}>쉬운UI</span>
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
