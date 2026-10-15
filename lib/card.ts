"use client";

const FONT = "Gaegu";
const NAVY = "#000080";
const YELLOW = "#ffe14d";

export const CTA = "나는 어떤 뼈일까? 테스트하기 →";
export const HASHTAGS = "#뼈BTI #비엘테크 #뼈대있는회사";

export type CardInfo = {
  short: string; // 쇄골
  nickname: string;
  style: string; // 일하는 스타일 요약
  injury: string; // 조심할 순간
  brace: string; // 나를 지키는 보조기
  fact: string; // 뼈 상식 요약
  oneLiner: string;
};

/** 공유 카드 2종 합성: 세로 1200×1500(다운로드/앱 공유용), 가로 1200×630(페이스북 링크 미리보기용) */
export async function makeShareCards(imageSrc: string, info: CardInfo): Promise<{ card: Blob; og: Blob }> {
  // 구글 폰트는 한글을 글자 범위별로 쪼개 내려주므로, 실제로 쓸 글자를 넘겨서 미리 받아둔다
  const text = `나는 206개 뼈 중 【】"' 💼🛡️⚠️💡 일하는 스타일 조심할 순간 나를 지키는 보조기 뼈 상식 : ${CTA}${HASHTAGS}${Object.values(info).join("")}`;
  await Promise.all([document.fonts.load(`700 40px ${FONT}`, text), document.fonts.load(`400 40px ${FONT}`, text)]).catch(
    () => {},
  );
  const img = await loadImage(imageSrc);
  const [card, og] = await Promise.all([toJpeg(drawPortrait(img, info)), toJpeg(drawLandscape(img, info))]);
  return { card, og };
}

function drawPortrait(img: HTMLImageElement, info: CardInfo) {
  const W = 1200;
  const H = 1500;
  const { canvas, ctx } = blank(W, H);

  // 상단: 그림
  const side = 820;
  const ix = (W - side) / 2;
  const iy = 44;
  ctx.drawImage(img, ix, iy, side, side);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#000";
  ctx.strokeRect(ix, iy, side, side);

  // 제목
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  const title = `🦴 나는 206개 뼈 중 【${info.short}】`;
  ctx.font = `700 ${fitFont(ctx, title, W - 120, 60)}px ${FONT}`;
  ctx.fillText(title, W / 2, 950);

  ctx.fillStyle = NAVY;
  const nick = `"${info.nickname}"`;
  ctx.font = `700 ${fitFont(ctx, nick, W - 160, 50)}px ${FONT}`;
  ctx.fillText(nick, W / 2, 1018);

  ctx.fillStyle = "#000";
  ctx.fillRect(90, 1048, W - 180, 3);

  // 항목
  ctx.textAlign = "left";
  const rows: [string, string][] = [
    ["💼 일하는 스타일", info.style],
    ["⚠️ 조심할 순간", info.injury],
    ["🛡️ 나를 지키는 보조기", info.brace],
    ["💡 뼈 상식", info.fact],
  ];
  let y = 1106;
  for (const [label, value] of rows) {
    drawRow(ctx, label, value, 90, y, W - 180, 38);
    y += 56;
  }

  // 버튼
  drawButton(ctx, CTA, 150, 1316, W - 300, 78, 40);

  // 해시태그
  ctx.textAlign = "center";
  ctx.fillStyle = "#555";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText(HASHTAGS, W / 2, 1458);
  return canvas;
}

function drawLandscape(img: HTMLImageElement, info: CardInfo) {
  const W = 1200;
  const H = 630;
  const pad = 24;
  const { canvas, ctx } = blank(W, H);

  const side = H - pad * 2;
  ctx.drawImage(img, pad, pad, side, side);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.strokeRect(pad, pad, side, side);

  const x = pad * 2 + side + 6;
  const maxW = W - x - pad;
  ctx.textAlign = "left";

  ctx.fillStyle = "#555";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText("🦴 나는 206개 뼈 중", x, 76);

  ctx.fillStyle = "#000";
  const big = `【${info.short}】`;
  ctx.font = `700 ${fitFont(ctx, big, maxW, 76)}px ${FONT}`;
  ctx.fillText(big, x - 8, 160);

  ctx.fillStyle = NAVY;
  const nick = `"${info.nickname}"`;
  ctx.font = `700 ${fitFont(ctx, nick, maxW, 40)}px ${FONT}`;
  ctx.fillText(nick, x, 216);

  ctx.fillStyle = "#000";
  ctx.fillRect(x, 238, maxW, 3);

  ctx.font = `400 32px ${FONT}`;
  wrap(ctx, info.oneLiner, maxW, 4).forEach((line, i) => ctx.fillText(line, x, 290 + i * 40));

  drawButton(ctx, CTA, x, H - pad - 84, maxW, 76, 30);
  return canvas;
}

function blank(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  return { canvas, ctx };
}

function drawRow(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, maxW: number, size: number) {
  const head = `${label} : `;
  ctx.font = `700 ${size}px ${FONT}`;
  const headW = ctx.measureText(head).width;
  ctx.fillStyle = NAVY;
  ctx.fillText(head, x, y);

  ctx.fillStyle = "#000";
  ctx.font = `400 ${size}px ${FONT}`;
  ctx.fillText(wrap(ctx, value, maxW - headW, 1)[0] ?? "", x + headW, y);
}

function drawButton(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, w: number, h: number, size: number) {
  ctx.fillStyle = "#000";
  ctx.fillRect(x + 6, y + 6, w, h);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#000";
  ctx.font = `700 ${fitFont(ctx, label, w - 30, size)}px ${FONT}`;
  const prev = ctx.textAlign;
  ctx.textAlign = "center";
  ctx.fillText(label, x + w / 2, y + h / 2 + size * 0.33);
  ctx.textAlign = prev;
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

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, start: number) {
  let size = start;
  while (size > 18) {
    ctx.font = `700 ${size}px ${FONT}`;
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
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return toJpeg(canvas);
}
