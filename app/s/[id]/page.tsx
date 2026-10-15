import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getShare } from "@/lib/shares";
import PaintWindow from "@/components/PaintWindow";
import { Disclaimer } from "@/components/Studio";

type Props = { params: Promise<{ id: string }> };

const load = cache(getShare);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await load(id);
  if (!share) return { title: "결과를 찾을 수 없어요" };

  const { meta, ogUrl } = share;
  const title = `나는 206개 뼈 중 【${meta.short}】 "${meta.nickname}"`;
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

  return (
    <main className="desktop">
      <PaintWindow title={`${meta.short}.bmp - 그림판`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="share-card" src={cardUrl} alt={`뼈BTI 결과: ${meta.name}`} />
        <section className="bio">
          <h2>
            {meta.name} <small>· {meta.typeLabel}</small>
          </h2>
          <p>{meta.personality}</p>
          <p>💡 {meta.fun_fact}</p>
        </section>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            나는 어떤 뼈일까? 테스트하기 →
          </Link>
        </div>
        <Disclaimer />
      </PaintWindow>
    </main>
  );
}
