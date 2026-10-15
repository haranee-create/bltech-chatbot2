import type { Metadata } from "next";
import Link from "next/link";
import PaintWindow from "@/components/PaintWindow";
import ProductUse from "@/components/ProductUse";
import { BONES, BONE_TYPES, TYPE_LABEL, YOUTUBE_CHANNEL } from "@/lib/bones";

export const metadata: Metadata = {
  title: "뼈BTI 제품 도감 — 우리 제품은 어디에 어떻게 쓰일까?",
  description: "뼈마다 그 부위를 지켜주는 비엘테크 제품과 시술 방법, 시술 영상을 모았어요.",
};

export default function GuidePage() {
  return (
    <main className="desktop">
      <PaintWindow title="제품 도감 - 그림판">
        <div className="intro">
          <h1>
            🦴 뼈BTI <span className="hl">제품 도감</span>
          </h1>
          <p>뼈마다 그 부위를 지켜주는 우리 제품과, 실제로 어떻게 쓰이는지 시술 영상으로 알아봐요.</p>
        </div>

        <nav className="guide-toc">
          {BONES.map((b) => (
            <a key={b.id} href={`#${b.id}`}>
              {b.short}
            </a>
          ))}
        </nav>

        {BONE_TYPES.map((t) => (
          <section key={t} className="guide-type">
            <h2 className="step">{TYPE_LABEL[t]}</h2>
            {BONES.filter((b) => b.type === t).map((b) => (
              <article key={b.id} id={b.id} className="guide-bone">
                <h3>
                  {b.name}
                </h3>
                <p className="guide-fact">
                  💡 {b.fact}
                  <br />
                  ⚠️ 잘 다치는 상황: {b.injury}
                </p>
                <ProductUse boneId={b.id} compact />
              </article>
            ))}
          </section>
        ))}

        <p className="use-more">
          🎬 더 많은 시술 영상은{" "}
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noreferrer">
            비엘테크 유튜브 채널
          </a>
          에서 볼 수 있어요.
        </p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            나는 어떤 뼈일까? 테스트하기 →
          </Link>
        </div>
        <p className="disclaimer">
          교육용 안내이며 의료 진단·치료 지침이 아닙니다. 실제 시술은 의료진의 판단에 따릅니다.
        </p>
      </PaintWindow>
    </main>
  );
}
