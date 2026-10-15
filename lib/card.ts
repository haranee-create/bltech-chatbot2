"use client";

const SERIF = '"Noto Serif KR", serif';
const SANS = '"Noto Sans KR", sans-serif';
const DISPLAY = '"Cormorant Garamond", "Noto Serif KR", serif';

const BG = "#f5f0e6";
const PAPER = "#fffdf8";
const INK = "#15233f";
const INK_SOFT = "#35425e";
const MUTED = "#7a7266";
const LINE = "#e5dccb";
const GOLD = "#a8844c";

export const CTA = "나는 어떤 뼈일까? 테스트하기 →";
export const HASHTAGS = "#뼈BTI #비엘테크 #뼈대있는회사";

export type CardInfo = {
  short: string; // 주상골
  nickname: string;
  role: string; // 리더형 · 방향을 정하고 사람을 모으는 사람
  roleName: string; // 리더형
  style: string; // 일하는 스타일 요약
  injury: string; // 조심할 순간
  brace: string; // 나를 지키는 제품
  fact: string; // 뼈 상식 요약
  oneLiner: string;
};

/** 공유 카드 2종 합성: 세로 1200×1500(다운로드/앱 공유용), 가로 1200×630(페이스북 링크 미리보기용) */
export async function makeShareCards(imageSrc: string, info: CardInfo): Promise<{ card: Blob; og: Blob }> {
  // 구글 폰트는 한글을 글자 범위별로 쪼개 내려주므로, 실제로 쓸 글자를 넘겨서 미리 받아둔다
  const text = `나는 206개 뼈 중 「」"' 회사 속 역할 일하는 스타일 조심할 순간 나를 지키는 제품 뼈 상식 BL tech 뼈BTI ${CTA}${HASHTAGS}${Object.values(info).join("")}`;
  await Promise.all(
    [`900 40px ${SERIF}`, `700 40px ${SERIF}`, `600 40px ${SERIF}`, `400 40px ${SANS}`, `500 40px ${SANS}`, `700 40px ${SANS}`, `600 40px ${DISPLAY}`].map(
      (f) => document.fonts.load(f, text),
    ),
  ).catch(() => {});
  const img = await loadImage(imageSrc);
  const [card, og] = await Promise.all([toJpeg(drawPortrait(img, info)), toJpeg(drawLandscape(img, info))]);
  return { card, og };
}

function drawPortrait(img: HTMLImageElement, info: CardInfo) {
  const W = 1200;
  const H = 1500;
  const { canvas, ctx } = blank(W, H);

  // 상단 브랜드
  ctx.textAlign = "center";
  ctx.fillStyle = GOLD;
  ctx.font = `600 30px ${DISPLAY}`;
  spaced(ctx, "BL TECH  ·  뼈BTI", W / 2, 64, 6);

  // 액자 속 그림
  drawFramed(ctx, img, 230, 96, 740);

  // 제목
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  const title = `나는 206개 뼈 중 「${info.short}」`;
  ctx.font = `900 ${fitFont(ctx, title, W - 160, 60, `900 {s}px ${SERIF}`)}px ${SERIF}`;
  ctx.fillText(title, W / 2, 940);

  ctx.fillStyle = GOLD;
  const nick = `“${info.nickname}”`;
  ctx.font = `600 ${fitFont(ctx, nick, W - 200, 42, `600 {s}px ${SERIF}`)}px ${SERIF}`;
  ctx.fillText(nick, W / 2, 1000);

  ctx.fillStyle = GOLD;
  ctx.fillRect(W / 2 - 50, 1030, 100, 2);

  // 항목
  ctx.textAlign = "left";
  const rows: [string, string][] = [
    ["회사 속 역할", info.role],
    ["일하는 스타일", info.style],
    ["조심할 순간", info.injury],
    ["나를 지키는 제품", info.brace],
    ["뼈 상식", info.fact],
  ];
  let y = 1090;
  for (const [label, value] of rows) {
    drawRow(ctx, label, value, 130, y, W - 260);
    y += 52;
  }

  // 버튼
  drawButton(ctx, CTA, (W - 660) / 2, 1352, 660, 74, 32);

  // 해시태그
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `500 26px ${SANS}`;
  ctx.fillText(HASHTAGS, W / 2, 1470);
  return canvas;
}

function drawLandscape(img: HTMLImageElement, info: CardInfo) {
  const W = 1200;
  const H = 630;
  const { canvas, ctx } = blank(W, H);

  drawFramed(ctx, img, 44, 44, 542);

  const x = 650;
  const maxW = W - x - 50;
  ctx.textAlign = "left";

  ctx.fillStyle = GOLD;
  ctx.font = `600 24px ${DISPLAY}`;
  spaced(ctx, "BL TECH  ·  뼈BTI", x, 82, 4);

  ctx.fillStyle = MUTED;
  ctx.font = `500 26px ${SANS}`;
  ctx.fillText("나는 206개 뼈 중", x, 140);

  ctx.fillStyle = INK;
  const big = `「${info.short}」`;
  ctx.font = `900 ${fitFont(ctx, big, maxW, 70, `900 {s}px ${SERIF}`)}px ${SERIF}`;
  ctx.fillText(big, x - 14, 222);

  ctx.fillStyle = GOLD;
  const nick = `“${info.nickname}”`;
  ctx.font = `600 ${fitFont(ctx, nick, maxW, 34, `600 {s}px ${SERIF}`)}px ${SERIF}`;
  ctx.fillText(nick, x, 276);

  ctx.fillStyle = INK_SOFT;
  ctx.font = `700 26px ${SANS}`;
  ctx.fillText(`회사 속 역할 · ${info.roleName}`, x, 330);

  ctx.fillStyle = INK;
  ctx.font = `400 26px ${SERIF}`;
  wrap(ctx, info.oneLiner, maxW, 3).forEach((line, i) => ctx.fillText(line, x, 384 + i * 38));

  drawButton(ctx, CTA, x, H - 44 - 70, maxW, 70, 26);
  return canvas;
}

/** 금빛 액자 + 아이보리 매트 안에 그림 */
function drawFramed(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number) {
  const frame = Math.round(size * 0.022);
  const mat = Math.round(size * 0.045);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 16;
  const g = ctx.createLinearGradient(x, y, x + size, y + size);
  g.addColorStop(0, "#d6b678");
  g.addColorStop(0.38, "#9a7440");
  g.addColorStop(0.62, "#e2c78f");
  g.addColorStop(1, "#8f6a36");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, size, size);
  ctx.restore();

  ctx.fillStyle = PAPER;
  ctx.fillRect(x + frame, y + frame, size - frame * 2, size - frame * 2);

  const inner = size - (frame + mat) * 2;
  ctx.drawImage(img, x + frame + mat, y + frame + mat, inner, inner);
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + frame + mat, y + frame + mat, inner, inner);
}

function blank(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  return { canvas, ctx };
}

/** 자간을 벌려 그리기 (canvas letterSpacing 미지원 브라우저 대비) */
function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, gap: number) {
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
  const align = ctx.textAlign;
  let cx = align === "center" ? x - total / 2 : x;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += widths[i] + gap;
  });
  ctx.textAlign = align;
}

function drawRow(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, maxW: number) {
  const labelW = 250;
  ctx.fillStyle = GOLD;
  ctx.font = `700 26px ${SANS}`;
  ctx.fillText(label, x, y);

  ctx.fillStyle = INK;
  const vw = maxW - labelW;
  let vs = 31;
  do {
    ctx.font = `500 ${vs}px ${SANS}`;
  } while (ctx.measureText(value).width > vw && (vs -= 1) >= 25);
  ctx.fillText(wrap(ctx, value, vw, 1)[0] ?? "", x + labelW, y);

  ctx.fillStyle = LINE;
  ctx.fillRect(x, y + 17, maxW, 1);
}

function drawButton(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, w: number, h: number, size: number) {
  ctx.save();
  ctx.shadowColor = "rgba(21,35,63,0.35)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = INK;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#fdf8ee";
  ctx.font = `700 ${fitFont(ctx, label, w - 50, size, `700 {s}px ${SERIF}`)}px ${SERIF}`;
  const prev = ctx.textAlign;
  ctx.textAlign = "center";
  ctx.fillText(label, x + w / 2, y + h / 2 + size * 0.36);
  ctx.textAlign = prev;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 띄어쓰기 기준 줄바꿈, 한 단어가 너무 길면 글자 단위로 자른다 */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const fits = (t: string) => ctx.measureText(t).width <= maxW;
  const lines: string[] = [];
  let cur = "";
  for (const word of text.trim().split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (fits(next)) {
      cur = next;
      continue;
    }
    if (cur) lines.push(cur);
    cur = "";
    for (const ch of Array.from(word)) {
      if (!fits(cur + ch) && cur) {
        lines.push(cur);
        cur = "";
      }
      cur += ch;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;

  const out = lines.slice(0, maxLines);
  let last = out[maxLines - 1];
  while (last && !fits(last + "…")) last = last.slice(0, -1);
  out[maxLines - 1] = last + "…";
  return out;
}

/** 글자가 maxW 안에 들어오는 가장 큰 크기. font 템플릿의 {s}에 크기가 들어간다 */
function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, start: number, font: string) {
  let size = start;
  while (size > 18) {
    ctx.font = font.replace("{s}", String(size));
    if (ctx.measureText(text).width <= maxW) break;
    size -= 2;
  }
  return size;
}

function toJpeg(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("카드 생성 실패"))), "image/jpeg", 0.9),
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    img.src = src;
  });
}

/** 업로드 전에 사진을 최대 1024px JPEG로 줄인다 (Vercel 요청 크기 제한 대비) */
export async function shrinkPhoto(file: File, max = 1024): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const { canvas, ctx } = blank(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return toJpeg(canvas);
}
