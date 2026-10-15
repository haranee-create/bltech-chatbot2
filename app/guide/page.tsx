import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import ProductUse from "@/components/ProductUse";
import { BONES, PRODUCTS, REGION_LABEL, YOUTUBE_CHANNEL, getBone, type Region } from "@/lib/bones";
import { ROLES, roleOfBone } from "@/lib/roles";

export const metadata: Metadata = {
  title: "제품 도감 — 나의 뼈BTI는?",
  description: "업무 유형마다 닮은 뼈, 그 뼈를 지켜주는 비엘테크 제품과 시술 방법, 시술 영상을 모았어요.",
};

const REGIONS: Region[] = ["arm", "leg"];

export default function GuidePage() {
  return (
    <Shell>
      <section className="hero">
        <p className="eyebrow">Product Field Guide</p>
        <h1>
          뼈BTI <em>제품 도감</em>
        </h1>
        <p className="hero-sub">10가지 업무 유형이 닮은 뼈, 그 뼈를 지켜주는 우리 제품과 실제 시술 영상을 모았어요.</p>
      </section>

      <section className="block">
        <p className="eyebrow">10 Work Types</p>
        <h2>업무 유형과 닮은 뼈</h2>
        <div className="role-table">
          {ROLES.map((r) => (
            <div key={r.id} className="role-row">
              <p className="role-row-name">
                <b>{r.name}</b> <i>{r.en}</i>
              </p>
              <p className="role-row-tag">{r.tagline}</p>
              <p className="role-row-bones">
                {r.bones.map((id) => {
                  const b = getBone(id)!;
                  return (
                    <a key={id} href={`#${id}`}>
                      {b.short} · {PRODUCTS[b.product].name}
                    </a>
                  );
                })}
              </p>
            </div>
          ))}
        </div>
      </section>

      {REGIONS.map((region) => (
        <section key={region} className="guide-type">
          <p className="eyebrow">{region === "arm" ? "Arm & Hand" : "Leg & Foot"}</p>
          <h2 className="section-title">{REGION_LABEL[region]}</h2>
          {BONES.filter((b) => b.region === region).map((b) => {
            const role = roleOfBone(b.id);
            return (
              <article key={b.id} id={b.id} className="block guide-bone">
                {role && <p className="badge">{role.name}의 뼈</p>}
                <h3>{b.name}</h3>
                <p className="guide-fact">
                  {b.fact}
                  <br />
                  잘 다치는 상황 · {b.injury}
                </p>
                <ProductUse boneId={b.id} compact />
              </article>
            );
          })}
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
          나의 뼈BTI 알아보기 →
        </Link>
      </div>
      <p className="hint">교육용 안내이며 의료 진단·치료 지침이 아닙니다. 실제 시술은 의료진의 판단에 따릅니다.</p>
    </Shell>
  );
}
