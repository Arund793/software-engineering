// src/components/easy/EasyModeOverlay/EasyModeOverlay.tsx
import { useState, useEffect, useRef } from "react";
import type { Tool } from "../../../types/tool";
import { getTools } from "../../../api/tools";
import { useAccessibility } from "../../../context/useAccessibility";
import s from "./EasyModeOverlay.module.css";

const EASY_CATEGORIES = [
    { id: null,           emoji: "🏠", label: "전체 보기" },
    { id: "write",        emoji: "✍️",  label: "글쓰기" },
    { id: "design",       emoji: "🎨", label: "디자인" },
    { id: "video",        emoji: "🎬", label: "영상·음악" },
    { id: "productivity", emoji: "📋", label: "업무 도구" },
    { id: "edu",          emoji: "📚", label: "교육·학습" },
    { id: "dev",          emoji: "💻", label: "개발" },
    { id: "life",         emoji: "🌱", label: "일상생활" },
    { id: "biz",          emoji: "💼", label: "비즈니스" },
];

const CAT_LABELS: Record<string, string[]> = {
    write:        ["글쓰기/콘텐츠", "글쓰기/컨텐츠"],
    design:       ["디자인/아트"],
    video:        ["비디오/오디오"],
    productivity: ["생산성/협업도구"],
    edu:          ["교육/학습"],
    dev:          ["개발/프로그래밍"],
    biz:          ["비즈니스/마케팅"],
    search:       ["검색/데이터"],
    ent:          ["엔터테인먼트/기타"],
    game:         ["게임"],
    life:         ["일상생활형 서비스"],
};

const FALLBACK_TOOLS: Tool[] = [
    { id: "f-chatgpt", name: "챗지피티 (ChatGPT)", subTitle: "대화형 AI",     categories: ["글쓰기/콘텐츠"], origin: "해외", url: "https://chatgpt.com/",           logo: "/gpt.png",          long: "무엇이든 물어볼 수 있는 AI 대화 서비스입니다." },
    { id: "f-claude",  name: "클로드 (Claude)",    subTitle: "대화형 AI",     categories: ["글쓰기/콘텐츠"], origin: "해외", url: "https://claude.ai/",            logo: "/claude.png",       long: "글쓰기와 분석에 강한 AI 어시스턴트입니다." },
    { id: "f-gemini",  name: "제미나이 (Gemini)",  subTitle: "Google AI",    categories: ["검색/데이터"],   origin: "해외", url: "https://gemini.google.com/",   logo: "/gemini.png",       long: "Google이 만든 AI 서비스입니다." },
    { id: "f-perp",    name: "퍼플렉시티",          subTitle: "AI 검색",       categories: ["검색/데이터"],   origin: "해외", url: "https://www.perplexity.ai/",   logo: "/perplexity.png",   long: "출처를 보여주는 AI 검색 서비스입니다." },
    { id: "f-mid",     name: "미드저니",             subTitle: "이미지 생성",   categories: ["디자인/아트"],   origin: "해외", url: "https://www.midjourney.com/",  logo: "/midjourney.png",   long: "글로 이미지를 만드는 AI입니다." },
    { id: "f-suno",    name: "수노 (Suno)",         subTitle: "음악 생성",     categories: ["비디오/오디오"], origin: "해외", url: "https://suno.com/",            logo: "/suno.png",         long: "AI가 음악을 직접 만들어 줍니다." },
    { id: "f-copilot", name: "깃허브 코파일럿",      subTitle: "코드 도우미",   categories: ["개발/프로그래밍"], origin: "해외", url: "https://github.com/features/copilot", logo: "/git.png", long: "코드 작성을 도와주는 AI입니다." },
    { id: "f-studios", name: "AI 스튜디오스",        subTitle: "영상 생성",     categories: ["비디오/오디오"], origin: "국내", url: "https://aistudios.com/",      logo: "/aistudios.png",    long: "AI 아바타로 영상을 만드는 서비스입니다." },
];

function fallbackFilter(catId: string | null, q: string) {
    const kw = q.trim().toLowerCase();
    const labels = catId ? (CAT_LABELS[catId] ?? []) : [];
    return FALLBACK_TOOLS.filter((t) => {
        const catMatch = !catId || t.categories?.some((c) => labels.includes(c));
        const kwMatch  = !kw || [t.name, t.subTitle, t.long].some((v) => v?.toLowerCase().includes(kw));
        return catMatch && kwMatch;
    });
}

export default function EasyModeOverlay() {
    const { toggleEasyMode } = useAccessibility();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [query,    setQuery]    = useState("");
    const [draft,    setDraft]    = useState(""); // 입력 중인 값
    const [items,    setItems]    = useState<Tool[]>([]);
    const [loading,  setLoading]  = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const serverCat = activeId ? CAT_LABELS[activeId]?.[0] ?? null : null;

    // 실제 검색은 query(확정) 기준
    useEffect(() => {
        let dead = false;
        (async () => {
            setLoading(true);
            try {
                const page = await getTools({ category: serverCat, q: query.trim() || null, page: 0, size: 20 });
                if (!dead) setItems(page.content);
            } catch {
                if (!dead) setItems(fallbackFilter(activeId, query));
            } finally {
                if (!dead) setLoading(false);
            }
        })();
        return () => { dead = true; };
    }, [serverCat, query, activeId]);

    const doSearch = () => setQuery(draft);

    const clear = () => {
        setDraft("");
        setQuery("");
        inputRef.current?.focus();
    };

    return (
        <div className={s.overlay}>

            {/* ── 검은 상단 헤더 (본 페이지 globalBar) ── */}
            <header className={s.topBar}>
                <div className={s.topBrand}>
                    <img src="/logo.png" alt="AI Hub 로고" className={s.topLogo} />
                    <span className={s.topTitle}>AI Hub</span>
                    <span className={s.topBadge}>쉬운 화면</span>
                </div>
                <button
                    className={s.exitBtn}
                    onClick={toggleEasyMode}
                    aria-label="일반 화면으로 돌아가기"
                >
                    ✕ 일반 화면으로
                </button>
            </header>

            {/* ── 서브 헤더 (본 페이지 subNav) ── */}
            <div className={s.subBar}>
                <span className={s.subBarTitle}>AI 서비스</span>
            </div>

            {/* ── 검색 영역 ── */}
            <div className={s.searchArea}>
                <p className={s.searchGuide}>원하는 AI 서비스를 검색해 보세요</p>
                <div className={s.searchRow}>
                    <div className={s.searchInputWrap}>
                        <span className={s.searchIcon} aria-hidden="true" />
                        <input
                            ref={inputRef}
                            className={s.searchInput}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") doSearch();
                                if (e.key === "Escape") clear();
                            }}
                            placeholder="예: 글쓰기, 이미지 만들기, 번역..."
                            aria-label="AI 서비스 검색"
                        />
                        {draft && (
                            <button className={s.clearBtn} onClick={clear} aria-label="검색어 지우기" type="button">
                                ×
                            </button>
                        )}
                    </div>
                    <button className={s.searchBtn} onClick={doSearch} type="button">
                        검색
                    </button>
                </div>
            </div>

            {/* ── 카테고리 ── */}
            <nav className={s.catArea} aria-label="카테고리 선택">
                <p className={s.catGuide}>카테고리를 선택하세요</p>
                <div className={s.catGrid}>
                    {EASY_CATEGORIES.map((c) => (
                        <button
                            key={String(c.id)}
                            className={`${s.catBtn} ${activeId === c.id ? s.catBtnActive : ""}`}
                            onClick={() => setActiveId(c.id)}
                            aria-pressed={activeId === c.id}
                            type="button"
                        >
                            <span className={s.catEmoji} aria-hidden="true">{c.emoji}</span>
                            <span className={s.catLabel}>{c.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* ── 결과 목록 ── */}
            <main className={s.results}>
                {loading && (
                    <div className={s.statusBox}>
                        <span className={s.loadingDot} />
                        <p className={s.statusText}>잠깐만 기다려 주세요...</p>
                    </div>
                )}

                {!loading && items.length === 0 && (
                    <div className={s.statusBox}>
                        <p className={s.statusText}>검색 결과가 없습니다.</p>
                        <button className={s.resetBtn} onClick={() => { setQuery(""); setDraft(""); setActiveId(null); }} type="button">
                            전체 목록 보기
                        </button>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className={s.list}>
                        {items.map((tool) => (
                            <EasyCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// ─── 개별 카드 ────────────────────────────────────────
function EasyCard({ tool }: { tool: Tool }) {
    const name    = tool.name.replace(/\s*\(.*?\)\s*$/, "").trim();
    const hasUrl  = Boolean(tool.url);
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <a
            className={s.card}
            href={tool.url}
            target={hasUrl ? "_blank" : undefined}
            rel={hasUrl ? "noreferrer" : undefined}
            aria-disabled={!hasUrl || undefined}
        >
            <div className={s.cardLogoBox}>
                {tool.logo && !imgFailed ? (
                    <img src={tool.logo} alt={name} onError={() => setImgFailed(true)} />
                ) : (
                    <span className={s.cardLogoFallback}>{name.slice(0, 1)}</span>
                )}
            </div>

            <div className={s.cardBody}>
                <p className={s.cardName}>{name}</p>
                {tool.subTitle && <p className={s.cardSub}>{tool.subTitle}</p>}
                {tool.long && <p className={s.cardDesc}>{tool.long}</p>}
            </div>

            {hasUrl && <span className={s.cardArrow} aria-hidden="true">›</span>}
        </a>
    );
}
