// CompassAIFrontend/src/pages/home/Home.tsx
import { useEffect, useState } from "react";
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
            } catch (err) {
                if (!dead) {
                    const message =
                        err instanceof Error ? err.message : String(err);
                    setError(message);
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
                <h1 className={s.title}>AI 툴을 빠르게 찾는 곳</h1>
                <p className={s.lead}>
                    원하는 작업을 검색하거나 카테고리를 선택해 필요한 AI 서비스를 찾아보세요.
                </p>
            </div>

            <SearchBar placeholder="AI 서비스 검색" onSearch={handleSearch} />

            <div className={s.categoryArea}>
                <CategoryBar items={CATEGORIES} activeId={active} onChange={setActive} />
            </div>

            {loading && (
                <p className={s.status}>불러오는 중…</p>
            )}

            {error && (
                <p className={`${s.status} ${s.error}`}>오류: {error}</p>
            )}

            {!loading && !error && (items.length === 0 ? (
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
        </section>
    );
}
