import Link from "next/link";
import PaintWindow from "@/components/PaintWindow";

export default function NotFound() {
  return (
    <main className="desktop">
      <PaintWindow title="오류 - 그림판">
        <div className="intro">
          <h1>결과를 찾을 수 없어요</h1>
          <p>링크가 잘못되었거나 지워진 결과예요.</p>
        </div>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            나는 어떤 뼈일까? 테스트하기 →
          </Link>
        </div>
      </PaintWindow>
    </main>
  );
}
