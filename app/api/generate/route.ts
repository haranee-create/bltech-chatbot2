import { NextResponse } from "next/server";
import { APIError } from "openai";
import { BONE_TYPES, QUESTIONS, TYPE_LABEL, matchBone, type BoneType } from "@/lib/bones";
import { drawBonePortrait, writeBoneResult } from "@/lib/openai";
import { DAILY_LIMIT, clientIp, refund, take } from "@/lib/ratelimit";
import type { GenerateResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const ip = clientIp(req);
  let charged = false;
  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return error("사진을 올려주세요.", 400);
    if (!ALLOWED.includes(file.type)) return error("JPG, PNG, WEBP 이미지만 올릴 수 있어요.", 400);
    if (file.size > MAX_BYTES) return error("이미지가 너무 커요 (최대 4MB).", 413);

    let answers: BoneType[];
    try {
      answers = JSON.parse(String(form.get("answers")));
    } catch {
      return error("질문에 모두 답해주세요.", 400);
    }
    if (
      !Array.isArray(answers) ||
      answers.length !== QUESTIONS.length ||
      !answers.every((a) => BONE_TYPES.includes(a))
    ) {
      return error("질문에 모두 답해주세요.", 400);
    }

    if (!take(ip)) return error(`오늘은 ${DAILY_LIMIT}번까지만 그릴 수 있어요. 내일 다시 와주세요!`, 429);
    charged = true;

    const bone = matchBone(answers);
    const buffer = Buffer.from(await file.arrayBuffer());

    // 사진은 그림에만 쓰고, 작문은 뼈 데이터만으로 한다 (얼굴로 사람을 판단하지 않음)
    const [writing, image] = await Promise.all([writeBoneResult(bone), drawBonePortrait(buffer, file.type, bone)]);

    const body: GenerateResponse = {
      image,
      writing,
      bone: {
        id: bone.id,
        type: bone.type,
        typeLabel: TYPE_LABEL[bone.type],
        name: bone.name,
        short: bone.short,
        injury: bone.injury,
        brace: bone.brace,
      },
    };
    return NextResponse.json(body);
  } catch (e) {
    console.error(e);
    if (charged) refund(ip);
    if (e instanceof APIError) {
      if (e.code === "moderation_blocked" || e.code === "content_policy_violation") {
        return error("이 사진은 그릴 수 없다고 하네요. 다른 사진으로 시도해 주세요.", 400);
      }
      if (e.status === 401) return error("OpenAI API 키가 올바르지 않습니다.", 500);
      if (e.status === 429) return error("요청이 몰려 있어요. 잠시 후 다시 시도해 주세요.", 429);
      return error(`OpenAI 오류: ${e.message}`, 502);
    }
    return error(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.", 500);
  }
}

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
