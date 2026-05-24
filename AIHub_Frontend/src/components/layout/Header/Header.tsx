// src/components/layout/Header/Header.tsx
import { Link, NavLink } from "react-router-dom";
import s from "./Header.module.css";
import { useAccessibility } from "@/context/useAccessibility";

const navClass = ({ isActive }: { isActive: boolean }) =>
    `${s.navLink} ${isActive ? s.navLinkActive : ""}`;

export default function Header() {
    const { theme, fontSize, toggleTheme, increaseFontSize, resetFontSize } =
        useAccessibility();

    return (
        <header className={s.header}>
            <div className={s.globalBar}>
                <div className={s.globalInner}>
                    <Link to="/" className={s.brand} aria-label="AI Hub 홈">
                        <img className={s.logo} src="/logo.png" alt="AI Hub 로고" />
                        <span className={s.text}>AI Hub</span>
                    </Link>

                    <nav className={s.nav} aria-label="주요 메뉴">
                        <NavLink to="/" end className={navClass}>
                            둘러보기
                        </NavLink>
                        <NavLink to="/help" className={navClass}>
                            고객센터
                        </NavLink>
                        <NavLink to="/submit" className={navClass}>
                            등록
                        </NavLink>
                    </nav>

                    <div className={s.controls} aria-label="접근성 컨트롤">
                        <button
                            id="font-size-btn"
                            type="button"
                            className={s.accessBtn}
                            onClick={increaseFontSize}
                            title="글자 크기 변경"
                            aria-label="글자 크기 변경"
                        >
                            <span className={s.accessIcon} aria-hidden="true">가</span>
                            <span className={s.accessLabel}>크기</span>
                        </button>

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

                        <button
                            id="theme-toggle-btn"
                            type="button"
                            className={s.themeBtn}
                            onClick={toggleTheme}
                            title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
                            aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
                            aria-pressed={theme === "dark"}
                        >
                            <span aria-hidden="true">{theme === "light" ? "D" : "L"}</span>
                            <span className={s.accessLabel}>
                                {theme === "light" ? "다크" : "라이트"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className={s.subNav}>
                <div className={s.subInner}>
                    <Link to="/" className={s.subTitle}>
                        AI 서비스
                    </Link>
                    <div className={s.subLinks}>
                        <NavLink to="/" end className={navClass}>
                            카탈로그
                        </NavLink>
                        <NavLink to="/help" className={navClass}>
                            도움말
                        </NavLink>
                        <NavLink to="/submit" className={s.buyLink}>
                            등록하기
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
}
