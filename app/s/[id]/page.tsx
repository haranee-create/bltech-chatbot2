import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getShare } from "@/lib/shares";
import { getRole } from "@/lib/roles";
import Shell from "@/components/Shell";
import ProductUse from "@/components/ProductUse";
import { RoleSection } from "@/components/Studio";

type Props = { params: Promise<{ id: string }> };

const load = cache(getShare);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await load(id);
  if (!share) return { title: "결과를 찾을 수 없어요" };

  const { meta, ogUrl } = share;
  const role = getRole(meta.roleId);
  const title = `나는 206개 뼈 중 【${meta.short}】 "${meta.nickname}"${role ? ` · ${role.name}` : ""}`;
  const description = `${meta.one_liner} · 나는 어떤 뼈일까? #뼈BTI #비엘테크`;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogUrl] },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const share = await load(id);
  if (!share) notFound();
  const { meta, cardUrl } = share;
  const role = getRole(meta.roleId);

  return (
    <Shell>
      <section className="result-hero">
        <p className="eyebrow">{meta.typeLabel}</p>
        <p className="result-kicker">206개의 뼈 중 이 동료는</p>
        <h1 className="result-title">{meta.name}</h1>
        <p className="result-nick">&ldquo;{meta.nickname}&rdquo;</p>
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="share-card" src={cardUrl} alt={`뼈BTI 결과: ${meta.name}`} />

      <div className="cta">
        <Link href="/" className="btn btn-primary">
          나는 어떤 뼈일까? 테스트하기 →
        </Link>
      </div>

      {role && meta.role_story && (
        <RoleSection roleId={role.id} name={role.name} en={role.en} tagline={role.tagline} story={meta.role_story} />
      )}

      <section className="block">
        <p className="eyebrow">Bone Profile</p>
        <h2>뼈로 보는 이 동료</h2>
        <dl className="facts">
          <div className="card-soft wide">
            <dt>일하는 스타일</dt>
            <dd>{meta.personality}</dd>
          </div>
          <div className="card-soft wide">
            <dt>반전 뼈 상식</dt>
            <dd>{meta.fun_fact}</dd>
          </div>
        </dl>
      </section>

      {meta.boneId && (
        <section className="block">
          <p className="eyebrow">Protected by BL tech</p>
          <h2>이 뼈를 지키는 비엘테크 제품</h2>
          <ProductUse boneId={meta.boneId} />
          <p className="guide-link">
            <Link href="/guide">우리 제품 도감 보기 →</Link>
          </p>
        </section>
      )}
    </Shell>
  );
}
