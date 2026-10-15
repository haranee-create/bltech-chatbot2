import Link from "next/link";
import Shell from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <section className="hero">
        <p className="eyebrow">Not Found</p>
        <h1>결과를 찾을 수 없어요</h1>
        <p className="hero-sub">링크가 잘못되었거나 지워진 결과예요.</p>
      </section>
      <div className="cta">
        <Link href="/" className="btn btn-primary">
          나의 뼈BTI 알아보기 →
        </Link>
      </div>
    </Shell>
  );
}
