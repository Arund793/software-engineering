import { Link } from "react-router-dom";
import s from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={s.footer}>
            <div className={s.inner}>
                <div className={s.columns}>
                    <section>
                        <h2>탐색</h2>
                        <Link to="/">AI 카탈로그</Link>
                        <Link to="/submit">서비스 등록</Link>
                        <Link to="/help">고객센터</Link>
                    </section>

                    <section>
                        <h2>카테고리</h2>
                        <span>글쓰기/콘텐츠</span>
                        <span>디자인/아트</span>
                        <span>개발/프로그래밍</span>
                    </section>

                    <section>
                        <h2>CompassAI</h2>
                        <span>검수 기반 AI 서비스 디렉터리</span>
                        <span>단일 검색과 카테고리 탐색</span>
                        <span>한국어 사용자 흐름 최적화</span>
                    </section>
                </div>

                <div className={s.legal}>
                    <span>© {new Date().getFullYear()} CompassAI</span>
                    <span>AI Hub frontend</span>
                </div>
            </div>
        </footer>
    );
}
