import Link from "next/link";

/** 모든 페이지 공통 틀: 상단 브랜드 바, 본문, 하단 고지 */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">BL tech</span>
          <span className="brand-sep" aria-hidden />
          <span className="brand-app">뼈BTI</span>
        </Link>
        <nav className="site-nav">
          <Link href="/guide">제품 도감</Link>
        </nav>
      </header>
      <main className="page">{children}</main>
      <footer className="site-footer">
        <p>재미용 테스트이며 의료 진단이 아닙니다. 사진은 그림 생성에만 쓰이고 저장되지 않습니다.</p>
        <p className="site-footer-brand">© BL tech · 뼈대 있는 회사</p>
      </footer>
    </>
  );
}
