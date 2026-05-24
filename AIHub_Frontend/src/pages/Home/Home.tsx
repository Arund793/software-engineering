// CompassAIFrontend/src/pages/home/Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import s from "./Home.module.css";
import CategoryBar from "../../components/tool/CategoryBar/CategoryBar";
import SearchBar from "../../components/tool/SearchBar/SearchBar";
import ToolGrid from "../../components/tool/ToolGrid/ToolGrid";
import type { Category } from "../../types/category";
import type { Tool } from "../../types/tool";
import { getTools } from "../../api/tools";

const CATEGORIES: Category[] = [
    { id: "write",         label: "글쓰기/콘텐츠" },
    { id: "design",        label: "디자인/아트" },
    { id: "video",         label: "비디오/오디오" },
    { id: "productivity",  label: "생산성/협업도구" },
    { id: "edu",           label: "교육/학습" },
    { id: "dev",           label: "개발/프로그래밍" },
    { id: "biz",           label: "비즈니스/마케팅" },
    { id: "search",        label: "검색/데이터" },
    { id: "ent",           label: "엔터테인먼트/기타" },
    { id: "game",          label: "게임" },
    { id: "life",          label: "일상생활형 서비스" },
];

const CAT_LABELS: Record<string, string[]> = {
    write: ["글쓰기/콘텐츠", "글쓰기/컨텐츠"],
    design: ["디자인/아트"],
    video: ["비디오/오디오"],
    productivity: ["생산성/협업도구"],
    edu: ["교육/학습"],
    dev: ["개발/프로그래밍"],
    biz: ["비즈니스/마케팅"],
    search: ["검색/데이터"],
    ent: ["엔터테인먼트/기타"],
    game: ["게임"],
    life: ["일상생활형 서비스"],
};

const FEATURED_LOGOS = [
    { src: "/gpt.png", alt: "ChatGPT" },
    { src: "/claude.png", alt: "Claude" },
    { src: "/gemini.png", alt: "Gemini" },
    { src: "/perplexity.png", alt: "Perplexity" },
    { src: "/midjourney.png", alt: "Midjourney" },
    { src: "/suno.png", alt: "Suno" },
];

const FALLBACK_TOOLS: Tool[] = [
    {
        id: "fallback-chatgpt",
        name: "챗지피티 (ChatGPT)",
        subTitle: "대화형 AI",
        categories: ["글쓰기/콘텐츠", "생산성/협업도구", "교육/학습", "개발/프로그래밍"],
        origin: "해외",
        url: "https://chatgpt.com/",
        logo: "/gpt.png",
        long: "자연어 기반의 대화형 AI로 글쓰기, 학습, 코딩, 아이디어 정리에 폭넓게 활용됩니다.",
    },
    {
        id: "fallback-claude",
        name: "클로드 (Claude)",
        subTitle: "대화형 어시스턴트",
        categories: ["글쓰기/콘텐츠", "생산성/협업도구", "개발/프로그래밍"],
        origin: "해외",
        url: "https://claude.ai/",
        logo: "/claude.png",
        long: "긴 문서 이해와 구조화된 글쓰기, 분석 작업에 강한 AI 어시스턴트입니다.",
    },
    {
        id: "fallback-gemini",
        name: "제미나이 (Gemini)",
        subTitle: "Google의 대화형 AI",
        categories: ["글쓰기/콘텐츠", "생산성/협업도구", "검색/데이터"],
        origin: "해외",
        url: "https://gemini.google.com/",
        logo: "/gemini.png",
        long: "검색, 작성, 계획 수립 등 Google 생태계와 연결된 작업에 활용되는 AI입니다.",
    },
    {
        id: "fallback-perplexity",
        name: "퍼플렉시티 (Perplexity AI)",
        subTitle: "AI 검색 엔진",
        categories: ["검색/데이터", "교육/학습", "글쓰기/콘텐츠"],
        origin: "해외",
        url: "https://www.perplexity.ai/",
        logo: "/perplexity.png",
        long: "질문 기반 검색과 출처 중심 답변을 제공하는 AI 검색 서비스입니다.",
    },
    {
        id: "fallback-midjourney",
        name: "미드저니 (Midjourney)",
        subTitle: "이미지 생성 플랫폼",
        categories: ["디자인/아트"],
        origin: "해외",
        url: "https://www.midjourney.com/",
        logo: "/midjourney.png",
        long: "텍스트 프롬프트를 기반으로 고품질 이미지를 생성하는 크리에이티브 플랫폼입니다.",
    },
    {
        id: "fallback-suno",
        name: "수노 (Suno)",
        subTitle: "음악 생성 플랫폼",
        categories: ["비디오/오디오", "엔터테인먼트/기타"],
        origin: "해외",
        url: "https://suno.com/",
        logo: "/suno.png",
        long: "아이디어나 가사를 바탕으로 음악을 생성하는 AI 오디오 서비스입니다.",
    },
    {
        id: "fallback-aistudios",
        name: "AI 스튜디오스 (AI STUDIOS)",
        subTitle: "가상인간 영상합성",
        categories: ["비디오/오디오", "비즈니스/마케팅"],
        origin: "국내",
        url: "https://aistudios.com/",
        logo: "/aistudios.png",
        long: "텍스트를 기반으로 AI 휴먼 영상을 제작하는 국내 영상 생성 서비스입니다.",
    },
    {
        id: "fallback-github-copilot",
        name: "깃허브 코파일럿 (GitHub Copilot)",
        subTitle: "코드 작성 도우미",
        categories: ["개발/프로그래밍", "생산성/협업도구"],
        origin: "해외",
        url: "https://github.com/features/copilot",
        logo: "/git.png",
        long: "코드 자동완성, 설명, 테스트 작성 등을 지원하는 개발자용 AI 도구입니다.",
    },
];

function fallbackTools(category: string | null, q: string) {
    const keyword = q.trim().toLowerCase();
    return FALLBACK_TOOLS.filter((tool) => {
        const categoryMatch = !category || tool.categories?.includes(category);
        const keywordMatch =
            !keyword ||
            [tool.name, tool.subTitle, tool.long]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(keyword));
        return categoryMatch && keywordMatch;
    });
}

export default function Home() {
    const [active, setActive] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (q: string) => setQuery(q);

    const serverCategory = active ? CAT_LABELS[active]?.[0] ?? null : null;

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const page = await getTools({
                    category: serverCategory,
                    q: query.trim() || null,
                    page: 0,
                    size: 60,
                });
                if (!dead) setItems(page.content);
            } catch {
                if (!dead) {
                    setItems(fallbackTools(serverCategory, query));
                    setError("서버 연결이 불안정해 기본 목록을 표시합니다.");
                }
            } finally {
                if (!dead) setLoading(false);
            }
        })();
        return () => {
            dead = true;
        };
    }, [serverCategory, query]);

    return (
        <section className={s.home}>
            <div className={s.hero}>
                <p className={s.eyebrow}>AI Hub</p>
                <h1 className={s.title}>AI 툴을 빠르게 찾는 곳</h1>
                <p className={s.lead}>
                    원하는 작업에 맞는 서비스를 검색하고, 검수된 카테고리로 비교해 보세요.
                </p>

                <div className={s.heroActions}>
                    <a className={s.primaryAction} href="#catalog">
                        둘러보기
                    </a>
                    <Link className={s.secondaryAction} to="/submit">
                        등록하기
                    </Link>
                </div>

                <div className={s.productStage} aria-label="대표 AI 서비스">
                    {FEATURED_LOGOS.map((item) => (
                        <span className={s.logoTile} key={item.src}>
                            <img src={item.src} alt={item.alt} />
                        </span>
                    ))}
                </div>
            </div>

            <div id="catalog" className={s.catalogBar}>
                <SearchBar placeholder="AI 서비스 검색" onSearch={handleSearch} />

                <div className={s.categoryArea}>
                    <CategoryBar items={CATEGORIES} activeId={active} onChange={setActive} />
                </div>
            </div>

            <div className={s.results}>
                {loading && (
                    <p className={s.status}>불러오는 중...</p>
                )}

                {error && (
                    <p className={`${s.status} ${s.warning}`}>{error}</p>
                )}

                {!loading && (items.length === 0 ? (
                    <p className={s.empty}>
                        {active
                            ? "선택한 카테고리에 해당하는 서비스가 없습니다."
                            : "해당하는 서비스가 없습니다."}
                    </p>
                ) : (
                    <div className={s.toolSection}>
                        <ToolGrid items={items} />
                    </div>
                ))}
            </div>
        </section>
    );
}
