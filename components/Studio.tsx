"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PaintWindow from "./PaintWindow";
import ProductUse from "./ProductUse";
import { makeShareCards, shrinkPhoto } from "@/lib/card";
import { QUESTIONS, type BoneType } from "@/lib/bones";
import type { GenerateResponse } from "@/lib/types";

const LOADING_LINES = [
  "그림판을 켜는 중...",
  "206개 뼈 중에 제비뽑기 중...",
  "마우스 펜 도구를 고르는 중...",
  "손을 덜덜 떨면서 선 긋는 중...",
  "뼈 의상 재단하는 중...",
  "페인트통으로 대충 색칠하는 중...",
  "삐져나간 색 못 본 척하는 중...",
  "보조기 트로피 닦는 중...",
];

type Phase = "idle" | "loading" | "done";
type Cards = { card: Blob; og: Blob; cardUrl: string };

export default function Studio() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(BoneType | null)[]>(() => QUESTIONS.map(() => null));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [cards, setCards] = useState<Cards | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const ready = !!photo && answers.every(Boolean);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, [phase]);

  // 결과가 나오면 공유 카드를 미리 합성
  useEffect(() => {
    if (!result) return;
    let url: string | null = null;
    const { bone, writing: w } = result;
    makeShareCards(result.image, {
      short: bone.short,
      nickname: w.nickname,
      style: w.card_style,
      injury: bone.injury,
      brace: bone.brace,
      fact: w.card_fact,
      oneLiner: w.one_liner,
    })
      .then(({ card, og }) => {
        url = URL.createObjectURL(card);
        setCards({ card, og, cardUrl: url });
      })
      .catch(() => setCards(null));
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result]);

  function choose(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    setError(null);
    setPhoto(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  function answer(qi: number, type: BoneType) {
    setAnswers((a) => a.map((v, i) => (i === qi ? type : v)));
  }

  async function generate() {
    if (!photo || !ready) return;
    setPhase("loading");
    setError(null);
    setResult(null);
    setCards(null);
    setShareUrl(null);
    setNotice(null);
    try {
      const small = await shrinkPhoto(photo);
      const fd = new FormData();
      fd.append("image", small, "photo.jpg");
      fd.append("answers", JSON.stringify(answers));
      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({ error: "서버 응답을 읽지 못했어요." }));
      if (!res.ok) throw new Error(data.error || "그림을 그리지 못했어요.");
      setResult(data as GenerateResponse);
      setPhase("done");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "그림을 그리지 못했어요.");
      setPhase("idle");
    }
  }

  function postText() {
    if (!result) return "";
    return `저는 ${result.bone.short}래요 🦴 "${result.writing.nickname}"… 여러분은 무슨 뼈예요?\n#뼈BTI #비엘테크 #뼈대있는회사`;
  }

  async function uploadShare(): Promise<string | null> {
    if (shareUrl) return shareUrl;
    if (!cards || !result) return null;
    const { bone, writing: w } = result;
    const fd = new FormData();
    fd.append("card", cards.card, "card.jpg");
    fd.append("og", cards.og, "og.jpg");
    fd.append(
      "meta",
      JSON.stringify({
        boneId: bone.id,
        short: bone.short,
        name: bone.name,
        typeLabel: bone.typeLabel,
        nickname: w.nickname,
        one_liner: w.one_liner,
        personality: w.personality,
        fun_fact: w.fun_fact,
      }),
    );
    const res = await fetch("/api/share", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { url } = await res.json();
    setShareUrl(url);
    return url;
  }

  async function shareFacebook() {
    if (!cards) return;
    // 팝업 차단을 피하려고 클릭 즉시 창을 먼저 연다
    const popup = window.open("about:blank", "fbshare", "width=640,height=640");
    setSharing(true);
    setNotice(null);
    try {
      // 페이스북은 게시글 문구를 미리 채울 수 없어서, 클립보드에 복사해 두고 붙여넣게 한다
      const copied = await navigator.clipboard?.writeText(postText()).then(
        () => true,
        () => false,
      );
      const url = await uploadShare();
      if (!url) {
        downloadCard();
        setNotice("공유 링크 저장소가 설정되지 않아 공유 이미지를 내려받았어요. 페이스북 글쓰기에 이미지를 직접 첨부해 주세요.");
      } else if (copied) {
        setNotice("게시글 문구를 복사했어요. 페이스북 글쓰기 칸에 붙여넣기 하세요!");
      }
      const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url ?? window.location.origin)}`;
      if (popup && !popup.closed) popup.location.href = fb;
      else window.open(fb, "_blank");
    } catch {
      popup?.close();
      setError("공유 링크를 만들지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSharing(false);
    }
  }

  async function shareNative() {
    if (!cards || !result) return;
    const file = new File([cards.card], `뼈BTI_${result.bone.short}.jpg`, { type: "image/jpeg" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: postText(), url: shareUrl ?? window.location.origin });
      } else {
        downloadCard();
      }
    } catch {
      /* 사용자가 공유 창을 닫음 */
    }
  }

  function downloadCard() {
    if (!cards || !result) return;
    const a = document.createElement("a");
    a.href = cards.cardUrl;
    a.download = `뼈BTI_${result.bone.short}.jpg`;
    a.click();
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setCards(null);
    setShareUrl(null);
    setNotice(null);
    setAnswers(QUESTIONS.map(() => null));
    setPhoto(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
  }

  if (phase === "done" && result) {
    const { bone, writing: w } = result;
    return (
      <PaintWindow title={`${bone.short}.bmp - 그림판`}>
        <div className="result-head">
          <p className="result-kicker">
            <b>{bone.typeLabel}</b> · 나는 206개 뼈 중
          </p>
          <h1>【{bone.name}】</h1>
          <p className="result-nick">&ldquo;{w.nickname}&rdquo;</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="portrait" src={result.image} alt={`${bone.short} 옷을 입은 그림판 그림`} />
        <p className="one-liner">{w.one_liner}</p>

        <dl className="facts">
          <dt>💼 일하는 스타일</dt>
          <dd>{w.personality}</dd>
          <dt>💡 반전 뼈 상식</dt>
          <dd>{w.fun_fact}</dd>
          <dt>⚠️ 조심할 순간</dt>
          <dd>{w.weakness}</dd>
          <dt>🛡️ 나를 지키는 보조기</dt>
          <dd>{w.guardian}</dd>
          <dt>🤝 업무 궁합</dt>
          <dd>{w.best_partner}</dd>
          <dt>🦴 오늘의 뼈 건강 한마디</dt>
          <dd>{w.bone_tip}</dd>
        </dl>

        <ProductUse boneId={bone.id} />
        <p className="guide-link">
          <Link href="/guide">📚 다른 뼈를 지키는 우리 제품도 보기 (제품 도감) →</Link>
        </p>

        <div className="actions">
          <button className="btn btn-fb" onClick={shareFacebook} disabled={!cards || sharing}>
            {sharing ? "공유 준비 중..." : "동료는 무슨 뼈일까? 페이스북 공유"}
          </button>
          <button className="btn" onClick={shareNative} disabled={!cards}>
            카톡 · 다른 앱 공유
          </button>
          <button className="btn" onClick={downloadCard} disabled={!cards}>
            공유 이미지 저장
          </button>
          <button className="btn" onClick={reset}>
            다시 하기
          </button>
        </div>
        {notice && <p className="notice">✅ {notice}</p>}

        {cards && (
          <figure className="card-preview">
            <figcaption>공유될 이미지 미리보기</figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cards.cardUrl} alt="공유 카드 미리보기" />
          </figure>
        )}
        {shareUrl && (
          <p className="share-link">
            공유 링크: <a href={shareUrl}>{shareUrl}</a>
          </p>
        )}
        {error && <p className="error">⚠️ {error}</p>}
        <Disclaimer />
      </PaintWindow>
    );
  }

  const loading = phase === "loading";
  return (
    <PaintWindow title="뼈BTI - 그림판">
      <div className="intro">
        <h1>
          나는 어떤 <span className="hl">뼈</span>일까? 🦴
        </h1>
        <p>사진 한 장과 질문 3개로 알아보는, 당신을 닮은 뼈</p>
        <p className="guide-link">
          <Link href="/guide">📚 우리 제품은 어디에 어떻게 쓰일까? 제품 도감 보기 →</Link>
        </p>
      </div>

      <h2 className="step">1. 사진 올리기</h2>
      <label
        className={`dropzone ${preview ? "has-photo" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files[0]);
        }}
      >
        <input type="file" accept="image/*" hidden onChange={(e) => choose(e.target.files?.[0])} disabled={loading} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="올린 사진" />
        ) : (
          <span>
            📷 여기를 눌러 사진 고르기
            <br />
            <small>또는 사진을 끌어다 놓기</small>
          </span>
        )}
      </label>
      <p className="hint">사진은 그림을 그리는 데만 쓰여요. 어떤 뼈인지는 질문 답으로만 정해져요.</p>

      <h2 className="step">2. 질문 3개</h2>
      {QUESTIONS.map((q, qi) => (
        <fieldset key={qi} className="question" disabled={loading}>
          <legend>
            Q{qi + 1}. {q.q}
          </legend>
          <div className="options">
            {q.options.map((o, oi) => (
              <button
                key={oi}
                type="button"
                className={`option ${answers[qi] === o.type ? "selected" : ""}`}
                aria-pressed={answers[qi] === o.type}
                onClick={() => answer(qi, o.type)}
              >
                <b>{String.fromCharCode(65 + oi)}.</b> {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="actions">
        <button className="btn btn-primary" onClick={generate} disabled={!ready || loading}>
          {loading ? LOADING_LINES[tick % LOADING_LINES.length] : "🦴 내 뼈 알아보기!"}
        </button>
      </div>
      {!ready && !loading && <p className="hint">사진을 올리고 질문 3개에 모두 답하면 시작할 수 있어요.</p>}
      {loading && <p className="hint">보통 30초 ~ 1분 정도 걸려요. 창을 닫지 말아 주세요.</p>}
      {error && <p className="error">⚠️ {error}</p>}
      <Disclaimer />
    </PaintWindow>
  );
}

export function Disclaimer() {
  return (
    <p className="disclaimer">
      재미용 테스트이며 의료 진단이 아닙니다. 사진은 그림 생성에만 쓰이고 저장되지 않습니다.
    </p>
  );
}
