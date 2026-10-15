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
  const title = `나의 업무 유형은 「${role?.name ?? meta.short}」 · 닮은 뼈 ${meta.short}`;
  const description = `${meta.one_liner} · 나는 어떤 유형, 어떤 뼈일까? #뼈BTI #비엘테크`;
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
        <p className="eyebrow">Colleague&apos;s Work Type</p>
        <p className="result-kicker">이 동료의 업무 유형은</p>
        <h1 className="result-title">{role?.name ?? meta.name}</h1>
        {role && (
          <p className="result-en">
            <i>{role.en}</i> — {role.tagline}
          </p>
        )}
      </section>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="share-card" src={cardUrl} alt={`뼈BTI 결과: ${role?.name ?? ""} · ${meta.name}`} />

      <div className="cta">
        <Link href="/" className="btn btn-primary">
          나의 업무 유형과 뼈 알아보기 →
        </Link>
      </div>

      {role && meta.role_story && meta.scores && (
        <RoleSection roleId={role.id} scores={meta.scores} story={meta.role_story} />
      )}

      <section className="block">
        <p className="eyebrow">Bone</p>
        <h2>
          {role ? `${role.name}을 닮은 뼈, ` : ""}
          <span className="accent">{meta.name}</span>
        </h2>
        <p className="block-sub">&ldquo;{meta.nickname}&rdquo;</p>
        <dl className="facts">
          <div className="card-soft wide">
            <dt>왜 {meta.short}일까?</dt>
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
          <h2>{meta.short}에게 필요한 우리 제품</h2>
          <ProductUse boneId={meta.boneId} brief />
          <p className="guide-link">
            <Link href="/guide">우리 제품 도감 보기 →</Link>
          </p>
        </section>
      )}
    </Shell>
  );
}
