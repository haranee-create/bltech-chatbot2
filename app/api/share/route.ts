import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import type { ShareMeta } from "@/lib/types";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;

const isJpeg = (v: unknown): v is File => v instanceof File && v.type === "image/jpeg" && v.size <= MAX_BYTES;

/** 합성된 공유 카드(세로/가로)를 Vercel Blob에 올리고 공유 페이지 주소를 돌려준다. */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "공유 저장소(Vercel Blob)가 설정되지 않았습니다." }, { status: 501 });
  }

  const form = await req.formData();
  const card = form.get("card");
  const og = form.get("og");
  const metaRaw = form.get("meta");
  if (!isJpeg(card) || !isJpeg(og) || typeof metaRaw !== "string") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  let meta: ShareMeta;
  try {
    const m = JSON.parse(metaRaw);
    meta = {
      boneId: clip(m.boneId, 30),
      roleId: clip(m.roleId, 30),
      short: clip(m.short, 20),
      name: clip(m.name, 40),
      typeLabel: clip(m.typeLabel, 10),
      nickname: clip(m.nickname, 30),
      one_liner: clip(m.one_liner, 120),
      personality: clip(m.personality, 600),
      fun_fact: clip(m.fun_fact, 200),
      role_story: clip(m.role_story, 3000),
    };
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const opts = { access: "public", addRandomSuffix: false } as const;
  await Promise.all([
    put(`shares/${id}/card.jpg`, card, { ...opts, contentType: "image/jpeg" }),
    put(`shares/${id}/og.jpg`, og, { ...opts, contentType: "image/jpeg" }),
    put(`shares/${id}/meta.json`, JSON.stringify(meta), { ...opts, contentType: "application/json" }),
  ]);

  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  return NextResponse.json({ id, url: `${origin}/s/${id}` });
}

function clip(v: unknown, max: number) {
  return String(v ?? "").slice(0, max);
}
