"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductUse from "./ProductUse";
import TraitMeter from "./TraitMeter";
import { makeShareCards, shrinkPhoto } from "@/lib/card";
import { DEPARTMENTS, QUESTIONS, ROLES, TRAIT_DESC, TRAIT_LABEL, getRole, josa, type Department, type Scores, type Trait } from "@/lib/roles";
import type { GenerateResponse } from "@/lib/types";

const LOADING_LINES = [
  "당신의 답을 성향 점수로 바꾸는 중…",
  "열 가지 업무 유형 중 당신의 자리를 찾는 중…",
  "206개의 뼈 중 당신을 닮은 뼈를 고르는 중…",
  "마우스를 덜덜 떨며 초상화를 그리는 중…",
  "페인트통으로 과감하게 칠하는 중…",
  "액자에 금박을 두르는 중…",
  "당신의 이야기를 쓰는 중…",
];

type Phase = "idle" | "loading" | "done";
type Cards = { card: Blob; og: Blob; cardUrl: string };

export default function Studio() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(Trait | null)[]>(() => QUESTIONS.map(() => null));
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
      roleName: role.name,
      roleTagline: role.tagline,
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
    return `저는 "${result.role.name}"이래요. 닮은 뼈는 ${result.bone.short} 🦴 여러분의 뼈BTI는요?\n#뼈BTI #비엘테크 #뼈대있는회사`;
  }

  async function uploadShare(): Promise<string | null> {
    if (shareUrl) return shareUrl;
    if (!cards || !result) return null;
    const { bone, role, scores, writing: w } = result;
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
        scores,
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
    const file = new File([cards.card], `뼈BTI_${result.role.name}_${result.bone.short}.jpg`, { type: "image/jpeg" });
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
    a.download = `뼈BTI_${result.role.name}_${result.bone.short}.jpg`;
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
    const { bone, role, scores, writing: w } = result;
    return (
      <article>
        <section className="result-hero">
          <p className="eyebrow">Your Work Type</p>
          <p className="result-kicker">{QUESTIONS.length}가지 질문으로 알아본 당신의 업무 유형은</p>
          <h1 className="result-title">{role.name}</h1>
          <p className="result-en">
            <i>{role.en}</i> — {role.tagline}
          </p>
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
            {role.name}을 닮은 뼈, {bone.short} · 마우스 드로잉, {new Date().getFullYear()}
          </figcaption>
        </figure>

        <p className="lead">{w.one_liner}</p>

        <RoleSection roleId={role.id} scores={scores} story={w.role_story}>
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
          <p className="eyebrow">Your Bone · {bone.en}</p>
          <h2>
            {role.name}을 닮은 뼈, <span className="accent">{bone.name}</span>
          </h2>
          <p className="block-sub">&ldquo;{w.nickname}&rdquo;</p>
          <dl className="facts">
            <div className="card-soft wide">
              <dt>왜 {bone.short}일까?</dt>
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
          <h2>{bone.short}에게 필요한 우리 제품</h2>
          <p className="guardian">{w.guardian}</p>
          <ProductUse boneId={bone.id} brief />
          <p className="guide-link">
            <Link href="/guide">다른 유형의 뼈와 우리 제품도 보기 — 제품 도감 →</Link>
          </p>
        </section>

        <section className="block share">
          <p className="eyebrow">Share</p>
          <h2>동료는 무슨 유형일까?</h2>
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
          나의 <em>뼈</em>BTI는?
        </h1>
        <p className="hero-sub">
          핵심 질문 {QUESTIONS.length}개로 알아보는 나의 업무 유형, 그리고 그런 나를 닮은 뼈와 그 뼈를 지키는 우리 제품
        </p>
        <p className="hero-link">
          <Link href="/guide">10가지 업무 유형과 뼈, 우리 제품 도감 →</Link>
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="num">01</span>
          <h2>사진</h2>
          <p className="panel-desc">초상화를 그리는 데만 쓰여요. 유형과 뼈는 질문 답으로만 정해져요.</p>
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
          <h2>업무 유형 질문</h2>
          <p className="panel-desc">{QUESTIONS.length}문항 · 약 1분. 정답은 없어요. 평소의 나를 떠올리며 빠르게 골라 주세요.</p>
        </div>
        <Quiz answers={answers} setAnswers={setAnswers} disabled={loading} />
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
            나의 뼈BTI 알아보기
          </button>
          {!ready && (
            <p className="hint">
              {!photo ? "사진을 올리고 " : ""}
              {answers.every(Boolean) ? "" : `질문 ${QUESTIONS.length}개에 모두 답하면 `}
              시작할 수 있어요.
            </p>
          )}
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}

/** 한 번에 한 질문씩. 고르면 자동으로 다음 질문, 점으로 이전 질문에 돌아갈 수 있다 */
function Quiz({
  answers,
  setAnswers,
  disabled,
}: {
  answers: (Trait | null)[];
  setAnswers: React.Dispatch<React.SetStateAction<(Trait | null)[]>>;
  disabled: boolean;
}) {
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = QUESTIONS.length;
  const done = answers.filter(Boolean).length;
  const q = QUESTIONS[step];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function pick(trait: Trait) {
    setAnswers((a) => a.map((v, i) => (i === step ? trait : v)));
    if (timer.current) clearTimeout(timer.current);
    if (step < total - 1) timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 260);
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="quiz-count">
          Q{step + 1}
          <small> / {total}</small>
        </span>
        <span className="quiz-progress" aria-hidden>
          <span style={{ width: `${(done / total) * 100}%` }} />
        </span>
        <span className="quiz-done">{done === total ? "모두 답했어요 ✓" : `${done}개 답함`}</span>
      </div>

      <fieldset className="question" disabled={disabled} key={step}>
        <legend className="quiz-q">{q.q}</legend>
        <div className="options">
          {q.options.map((o, oi) => (
            <button
              key={oi}
              type="button"
              className={`option ${answers[step] === o.trait ? "selected" : ""}`}
              aria-pressed={answers[step] === o.trait}
              onClick={() => pick(o.trait)}
            >
              <b>{String.fromCharCode(65 + oi)}.</b> {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="quiz-nav">
        <button type="button" className="link-btn" disabled={disabled || step === 0} onClick={() => setStep(step - 1)}>
          ← 이전
        </button>
        <span className="quiz-dots">
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`quiz-dot ${i === step ? "cur" : ""} ${answers[i] ? "done" : ""}`}
              aria-label={`${i + 1}번 질문${answers[i] ? " (답함)" : ""}`}
              disabled={disabled}
              onClick={() => setStep(i)}
            />
          ))}
        </span>
        <button
          type="button"
          className="link-btn"
          disabled={disabled || step === total - 1 || !answers[step]}
          onClick={() => setStep(step + 1)}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

/** 회사 속 나의 역할: 업무 성향 점수 · 역할 이야기 · 10가지 역할 중 내 위치 */
export function RoleSection({
  roleId,
  scores,
  story,
  children,
}: {
  roleId: string;
  scores: Scores;
  story: string;
  children?: React.ReactNode;
}) {
  const role = getRole(roleId);
  if (!role) return null;
  return (
    <section className="block">
      <p className="eyebrow">My Role at BL tech</p>
      <h2>
        회사 속 나의 역할, <span className="accent">{role.name}</span>
      </h2>
      <p className="block-sub">
        <i>{role.en}</i> — {role.tagline}
      </p>

      <h3 className="mini-title">나의 업무 성향</h3>
      <TraitMeter scores={scores} highlight={role.traits} />
      <p className="meter-summary">
        {role.traits.length === 2 ? (
          <>
            <b>{josa(TRAIT_LABEL[role.traits[0]], "과", "와")}</b> <b>{TRAIT_LABEL[role.traits[1]]}</b> 성향이 함께 강해요.{" "}
            {TRAIT_DESC[role.traits[0]]}과 {TRAIT_DESC[role.traits[1]]}을 고루 갖춘 {role.name}입니다.
          </>
        ) : (
          <>
            <b>{TRAIT_LABEL[role.traits[0]]}</b> 성향이 확실히 두드러져요. {TRAIT_DESC[role.traits[0]]}이 당신의 가장 큰 무기입니다.
          </>
        )}
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
        <p className="role-map-label">10가지 업무 유형 중 당신은</p>
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
