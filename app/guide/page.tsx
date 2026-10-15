import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import ProductUse from "@/components/ProductUse";
import { BONES, BONE_TYPES, TYPE_LABEL, YOUTUBE_CHANNEL } from "@/lib/bones";

export const metadata: Metadata = {
  title: "뼈BTI 제품 도감 — 우리 제품은 어디에 어떻게 쓰일까?",
  description: "뼈마다 그 부위를 지켜주는 비엘테크 제품과 시술 방법, 시술 영상을 모았어요.",
};

const TYPE_EN = { support: "Support", connect: "Connect", breakthrough: "Breakthrough", detail: "Detail" } as const;

export default function GuidePage() {
  return (
    <Shell>
      <section className="hero">
        <p className="eyebrow">Product Field Guide</p>
        <h1>
          뼈BTI <em>제품 도감</em>
        </h1>
        <p className="hero-sub">뼈마다 그 부위를 지켜주는 우리 제품과, 실제로 어떻게 쓰이는지 시술 영상으로 알아봐요.</p>
      </section>

      <nav className="guide-toc">
        {BONES.map((b) => (
          <a key={b.id} href={`#${b.id}`}>
            {b.short}
          </a>
        ))}
      </nav>

      {BONE_TYPES.map((t) => (
        <section key={t} className="guide-type">
          <p className="eyebrow">{TYPE_EN[t]}</p>
          <h2 className="section-title">{TYPE_LABEL[t]}</h2>
          {BONES.filter((b) => b.type === t).map((b) => (
            <article key={b.id} id={b.id} className="block guide-bone">
              <h3>{b.name}</h3>
              <p className="guide-fact">
                {b.fact}
                <br />
                잘 다치는 상황 · {b.injury}
              </p>
              <ProductUse boneId={b.id} compact />
            </article>
          ))}
        </section>
      ))}

      <p className="use-more">
        더 많은 시술 영상은{" "}
        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noreferrer">
          비엘테크 유튜브 채널
        </a>
        에서 볼 수 있어요.
      </p>
      <div className="cta">
        <Link href="/" className="btn btn-primary">
          나는 어떤 뼈일까? 테스트하기 →
        </Link>
      </div>
      <p className="hint">교육용 안내이며 의료 진단·치료 지침이 아닙니다. 실제 시술은 의료진의 판단에 따릅니다.</p>
    </Shell>
  );
}
