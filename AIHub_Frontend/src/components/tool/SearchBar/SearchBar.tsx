import { useEffect, useRef, useState } from "react";
import s from "./SearchBar.module.css";

type Props = {
    placeholder?: string;       // 입력창 placeholder 문구
    defaultValue?: string;      // 초기 입력값
    onSearch: (q: string) => void; // 검색 실행 시 부모로 전달되는 콜백
};

export default function SearchBar({
                                      placeholder = "AI 서비스 검색",
                                      defaultValue = "",
                                      onSearch,
                                  }: Props) {
    const [q, setQ] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setQ(defaultValue), [defaultValue]);

    const doSearch = () => onSearch(q.trim());

    const clear = () => {
        setQ("");
        onSearch("");
        inputRef.current?.focus();
    };

    return (
        <div className={s.wrap} role="search">
            <span className={s.searchMark} aria-hidden="true" />
            <input
                ref={inputRef}
                className={s.input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") doSearch();
                    if (e.key === "Escape") clear();
                }}
                placeholder={placeholder}
                aria-label="AI 툴 검색"
            />

            {q && (
                <button
                    className={s.clear}
                    onClick={clear}
                    aria-label="검색어 지우기"
                    type="button"
                >
                    ×
                </button>
            )}

            <button
                className={s.button}
                onClick={doSearch}
                type="button"
            >
                검색
            </button>
        </div>
    );
}
