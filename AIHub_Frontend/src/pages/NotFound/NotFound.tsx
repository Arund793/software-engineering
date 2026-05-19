import s from "./NotFound.module.css";

export default function NotFound() {
    return (
        <section className={s.wrap}>
            <h1 className={s.title}>404</h1>
            <p className={s.message}>페이지를 찾을 수 없습니다.</p>
        </section>
    );
}
