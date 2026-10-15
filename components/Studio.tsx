"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductUse from "./ProductUse";
import { makeShareCards, shrinkPhoto } from "@/lib/card";
import { QUESTIONS, type BoneType } from "@/lib/bones";
import { DEPARTMENTS, ROLES, type Department } from "@/lib/roles";
import type { GenerateResponse } from "@/lib/types";

const LOADING_LINES = [
  "206개의 뼈를 한 장씩 넘겨보는 중…",
  "당신의 역할을 회의실에 앉혀보는 중…",
  "마우스를 덜덜 떨며 초상화를 그리는 중…",
  "페인트통으로 과감하게 칠하는 중…",
  "삐져나간 색을 예술이라 부르는 중…",
  "액자에 금박을 두르는 중…",
  "제품 도감에서 보호대를 꺼내는 중…",
  "당신의 이야기를 쓰는 중…",
];

type Phase = "idle" | "loading" | "done";
type Cards = { card: Blob; og: Blob; cardUrl: string };

export default function Studio() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(BoneType | null)[]>(() => QUESTIONS.map(() => null));
  const [dept, setDept] = useState<Department | null>(null);
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
    const { bone, role, writing: w } = result;
    makeShareCards(result.image, {
      short: bone.short,
      nickname: w.nickname,
      role: `${role.name} · ${role.tagline}`,
      roleName: role.name,
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
      if (dept) fd.append("dept", dept);
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
    return `저는 ${result.bone.short}래요 🦴 회사에선 "${result.role.name}"이라네요… 여러분은 무슨 뼈예요?\n#뼈BTI #비엘테크 #뼈대있는회사`;
  }

  async function uploadShare(): Promise<string | null> {
    if (shareUrl) return shareUrl;
    if (!cards || !result) return null;
    const { bone, role, writing: w } = result;
    const fd = new FormData();
    fd.append("card", cards.card, "card.jpg");
    fd.append("og", cards.og, "og.jpg");
    fd.append(
      "meta",
      JSON.stringify({
        boneId: bone.id,
        roleId: role.id,
        short: bone.short,
        name: bone.name,
        typeLabel: bone.typeLabel,
        nickname: w.nickname,
        one_liner: w.one_liner,
        personality: w.personality,
        fun_fact: w.fun_fact,
        role_story: w.role_story,
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
    setDept(null);
    setPhoto(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    window.scrollTo({ top: 0 });
  }

  if (phase === "done" && result) {
    const { bone, role, writing: w } = result;
    return (
      <article>
        <section className="result-hero">
          <p className="eyebrow">
            {bone.typeLabel} · {bone.en}
          </p>
          <p className="result-kicker">206개의 뼈 중 당신은</p>
          <h1 className="result-title">{bone.name}</h1>
          <p className="result-nick">&ldquo;{w.nickname}&rdquo;</p>
        </section>

        <figure className="artwork">
          <div className="artwork-frame">
            <div className="artwork-mat">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.image} alt={`${bone.short} 옷을 입은 초상화`} />
            </div>
          </div>
          <figcaption className="plaque">
            <b>「{w.nickname}」</b>
            마우스 드로잉 · MS 그림판, {new Date().getFullYear()}
          </figcaption>
        </figure>

        <p className="lead">{w.one_liner}</p>

        <RoleSection roleId={role.id} name={role.name} en={role.en} tagline={role.tagline} story={w.role_story}>
          <div className="role-grid">
            <div className="card-soft">
              <h3>나의 강점</h3>
              <ul>
                {w.role_strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="card-soft">
              <h3>더 빛나려면</h3>
              <p>{w.role_growth}</p>
            </div>
          </div>
        </RoleSection>

        <section className="block">
          <p className="eyebrow">Bone Profile</p>
          <h2>뼈로 보는 나</h2>
          <dl className="facts">
            <div className="card-soft wide">
              <dt>일하는 스타일</dt>
              <dd>{w.personality}</dd>
            </div>
            <div className="card-soft">
              <dt>반전 뼈 상식</dt>
              <dd>{w.fun_fact}</dd>
            </div>
            <div className="card-soft">
              <dt>조심할 순간</dt>
              <dd>{w.weakness}</dd>
            </div>
            <div className="card-soft">
              <dt>업무 궁합</dt>
              <dd>{w.best_partner}</dd>
            </div>
            <div className="card-soft">
              <dt>오늘의 뼈 건강 한마디</dt>
              <dd>{w.bone_tip}</dd>
            </div>
          </dl>
        </section>

        <section className="block">
          <p className="eyebrow">Protected by BL tech</p>
          <h2>나를 지키는 비엘테크 제품</h2>
          <p className="guardian">{w.guardian}</p>
          <ProductUse boneId={bone.id} />
          <p className="guide-link">
            <Link href="/guide">다른 뼈를 지키는 우리 제품도 보기 — 제품 도감 →</Link>
          </p>
        </section>

        <section className="block share">
          <p className="eyebrow">Share</p>
          <h2>동료는 무슨 뼈일까?</h2>
          <div className="actions">
            <button className="btn btn-fb" onClick={shareFacebook} disabled={!cards || sharing}>
              {sharing ? "공유 준비 중…" : "페이스북에 공유"}
            </button>
            <button className="btn" onClick={shareNative} disabled={!cards}>
              카톡 · 다른 앱
            </button>
            <button className="btn" onClick={downloadCard} disabled={!cards}>
              이미지 저장
            </button>
            <button className="btn" onClick={reset}>
              다시 하기
            </button>
          </div>
          {notice && <p className="notice">{notice}</p>}
          {error && <p className="error">{error}</p>}
          {cards && (
            <figure className="card-preview">
              <figcaption>공유될 이미지</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cards.cardUrl} alt="공유 카드 미리보기" />
            </figure>
          )}
          {shareUrl && (
            <p className="share-link">
              공유 링크: <a href={shareUrl}>{shareUrl}</a>
            </p>
          )}
        </section>
      </article>
    );
  }

  const loading = phase === "loading";
  return (
    <>
      <section className="hero">
        <p className="eyebrow">BL tech · Employee Edition</p>
        <h1>
          나는 어떤 <em>뼈</em>일까?
        </h1>
        <p className="hero-sub">사진 한 장과 질문 세 개로 알아보는, 당신을 닮은 뼈와 회사 속 나의 역할</p>
        <p className="hero-link">
          <Link href="/guide">우리 제품은 어디에 어떻게 쓰일까? 제품 도감 →</Link>
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="num">01</span>
          <h2>사진</h2>
          <p className="panel-desc">초상화를 그리는 데만 쓰여요. 어떤 뼈인지는 질문 답으로만 정해져요.</p>
        </div>
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
            <span className="dz-empty">
              <span className="dz-icon" aria-hidden>
                ＋
              </span>
              <b>사진 고르기</b>
              <small>또는 여기로 끌어다 놓기</small>
            </span>
          )}
        </label>
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="num">02</span>
          <h2>세 가지 질문</h2>
        </div>
        {QUESTIONS.map((q, qi) => (
          <fieldset key={qi} className="question" disabled={loading}>
            <legend>
              <span className="q-num">Q{qi + 1}.</span>
              {q.q}
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
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="num">03</span>
          <h2>
            소속 <small>(선택)</small>
          </h2>
          <p className="panel-desc">고르면 &lsquo;회사 속 나의 역할&rsquo; 이야기가 내 업무 장면으로 쓰여요.</p>
        </div>
        <div className="chips">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              type="button"
              className={`chip ${dept === d ? "selected" : ""}`}
              aria-pressed={dept === d}
              disabled={loading}
              onClick={() => setDept((cur) => (cur === d ? null : d))}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="loading" role="status">
          <div className="spinner" aria-hidden />
          <p className="loading-line">{LOADING_LINES[tick % LOADING_LINES.length]}</p>
          <p className="hint">보통 30초 ~ 1분 정도 걸려요. 창을 닫지 말아 주세요.</p>
        </div>
      ) : (
        <div className="cta">
          <button className="btn btn-primary" onClick={generate} disabled={!ready}>
            내 뼈 알아보기
          </button>
          {!ready && <p className="hint">사진을 올리고 질문 세 개에 모두 답하면 시작할 수 있어요.</p>}
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}

/** 회사 속 나의 역할: 역할 이름 · 이야기 · 10가지 역할 중 내 위치 */
export function RoleSection({
  roleId,
  name,
  en,
  tagline,
  story,
  children,
}: {
  roleId: string;
  name: string;
  en: string;
  tagline: string;
  story: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="block">
      <p className="eyebrow">My Role at BL tech</p>
      <h2>
        회사 속 나의 역할, <span className="accent">{name}</span>
      </h2>
      <p className="block-sub">
        <i>{en}</i> — {tagline}
      </p>
      <div className="story">
        {story
          .split(/\n+/)
          .filter((p) => p.trim())
          .map((p, i) => (
            <p key={i}>{p}</p>
          ))}
      </div>
      {children}
      <div className="role-map">
        <p className="role-map-label">10가지 역할 유형 중 당신은</p>
        <div className="role-chips">
          {ROLES.map((r) => (
            <span key={r.id} className={`role-chip ${r.id === roleId ? "me" : ""}`} title={r.tagline}>
              {r.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
