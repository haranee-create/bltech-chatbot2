"use client";

import { useState } from "react";
import { PROCEDURES, PRODUCTS, YOUTUBE_CHANNEL, getBone } from "@/lib/bones";

/** 뼈 하나에 대해: 우리 제품은 무엇이고, 어디에 어떻게 쓰이며, 시술 영상은 무엇인지 */
export default function ProductUse({ boneId, compact = false }: { boneId: string; compact?: boolean }) {
  const bone = getBone(boneId);
  if (!bone) return null;
  const product = PRODUCTS[bone.product];
  const procedure = bone.procedure ? PROCEDURES[bone.procedure] : null;

  return (
    <section className={`use ${compact ? "use-compact" : ""}`}>
      {!compact && <h2 className="use-title">🏥 우리 제품은 이렇게 쓰여요</h2>}
      <div className="use-product">
        <p className="use-kind">{product.kind}</p>
        <p className="use-name">
          <a href={product.url} target="_blank" rel="noreferrer">
            {product.name} ↗
          </a>
        </p>
        <p className="use-howto">{product.howTo}</p>
      </div>

      {procedure ? (
        <div className="use-procedure">
          <p className="use-proc-name">
            🩹 <b>{procedure.name}</b> <span>({procedure.ko})</span>
          </p>
          <p className="use-area">{procedure.area}</p>
          <YouTube id={procedure.video.id} title={procedure.video.title} />
        </div>
      ) : (
        <p className="use-more">
          🎬 다른 시술 영상은{" "}
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noreferrer">
            비엘테크 유튜브
          </a>
          에서 볼 수 있어요.
        </p>
      )}
    </section>
  );
}

/** 썸네일만 먼저 보여주고, 누르면 그때 플레이어를 불러온다 (페이지가 무거워지지 않게) */
function YouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <figure className="yt">
      <div className="yt-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="yt-thumb" onClick={() => setPlay(true)} aria-label={`${title} 재생`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="yt-play">▶</span>
          </button>
        )}
      </div>
      <figcaption>
        🎬 {title} ·{" "}
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">
          유튜브에서 보기
        </a>
      </figcaption>
    </figure>
  );
}
