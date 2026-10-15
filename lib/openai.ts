import OpenAI, { APIError, toFile } from "openai";
import { BONES, PROCEDURES, PRODUCTS, type Bone } from "./bones";
import { QUESTIONS, TRAITS, TRAIT_LABEL, type Department, type Role, type Scores } from "./roles";
import type { BoneWriting } from "./types";

const IMAGE_MODEL = process.env.IMAGE_MODEL || "gpt-image-2.5-sunburst";
const TEXT_MODEL = process.env.TEXT_MODEL || "gpt-5.6-terra";
const IMAGE_QUALITY = (process.env.IMAGE_QUALITY || "medium") as "low" | "medium" | "high" | "xhigh" | "max";
const TEXT_REASONING = (process.env.TEXT_REASONING || "low") as "none" | "low" | "medium" | "high";

let client: OpenAI | null = null;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다. .env 파일(또는 Vercel 환경변수)에 키를 넣어주세요.");
  }
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

// ── 작문 ──────────────────────────────────────────

const str = (description: string) => ({ type: "string", description }) as const;

const WRITING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "bone",
    "nickname",
    "one_liner",
    "personality",
    "fun_fact",
    "weakness",
    "guardian",
    "bone_tip",
    "best_partner",
    "card_style",
    "card_fact",
    "role_story",
    "role_strengths",
    "role_growth",
  ],
  properties: {
    bone: str("뼈 이름"),
    nickname: str("이 뼈를 닮은 직장인 별명 (10자 이내, 예: '회의실의 빗장')"),
    one_liner: str("결과를 한 문장으로. 업무 유형과 뼈를 함께 담을 것 (40자 이내, 예: '팀을 일으켜 세우는 리더, 당신은 슬개골입니다!')"),
    personality: str("왜 이 업무 유형의 당신이 이 뼈를 닮았는지, 뼈의 실제 기능에 빗대 재치 있게 (2~3문장, [이 뼈를 닮은 이유] 참고)"),
    fun_fact: str("동료에게 자랑할 수 있는 이 뼈의 반전 상식 (1문장, 데이터에 있는 사실만)"),
    weakness: str("당신(=이 뼈)이 조심해야 할 순간 (1문장, 잘 다치는 상황을 직장 상황에 빗대되 실제 상황도 언급)"),
    guardian: str("당신을 지켜주는 보조기 소개 (1~2문장, [보조기 안내]를 따를 것)"),
    bone_tip: str("오늘의 뼈 건강 한마디 (예방 습관 1가지)"),
    best_partner: str("업무 궁합이 좋은 뼈와 이유 (1문장, [다른 뼈 목록] 중에서)"),
    card_style: str("공유 카드용 '일하는 스타일' 요약 (18자 이내, 예: '팀과 팀을 잇는 유일한 다리')"),
    card_fact: str("공유 카드용 뼈 상식 (25자 이내, 데이터에 있는 사실만)"),
    role_story: str(
      "회사 속 나의 역할 이야기. [회사 속 역할]과 뼈의 기능을 엮어, 비엘테크에서 당신이 어떤 역할을 하는 사람인지 보여준다. " +
        "4문단, 700~1000자, 문단 사이는 빈 줄. 2인칭 '당신'. " +
        "1문단: 당신이 팀에서 맡는 역할을 뼈의 기능에 빗대 소개. " +
        "2~3문단: 한 프로젝트나 하루(예: 신제품 출시 준비, 해외 바이어 미팅, 품질 이슈 대응, 월말 마감) 속 구체적인 장면 하나를 따라가며, 동료의 대사 한 줄과 당신이 한 행동을 보여줄 것. " +
        "4문단: 그 역할이 팀과 회사에 어떤 의미인지, 따뜻하고 자부심 있게 마무리.",
    ),
    role_strengths: {
      type: "array",
      description: "이 역할로서 당신의 강점 정확히 3개. 각 15자 이내의 짧은 구절 (예: '결정의 순간에 앞장섬')",
      items: { type: "string" },
    },
    role_growth: str("이 역할이 더 빛나기 위한 성장 포인트 (1~2문장, 따뜻한 조언. 단점 지적이 아니라 응원)"),
  },
} as const;

const SYSTEM = `너는 의료기기 회사 '비엘테크' 직원들을 위한 유쾌한 뼈 테스트 작가다.
정형외과 보조기를 만드는 회사 직원들이 웃으면서 뼈 상식과 우리 제품을 자연스럽게 배우고, 회사 속 자기 역할에 자부심을 느끼게 하는 것이 목표다.

규칙:
1. 의학적 사실과 제품 특징은 반드시 [뼈 데이터]와 [보조기 안내]에 있는 내용만 사용한다. 새로운 의학 사실이나 제품 기능을 지어내지 않는다.
2. 뼈의 특징을 직장인의 성격·업무 스타일에 빗대 재치 있게 표현한다. (회의, 결재, 야근, 점심, 커피 등 사무실/공장 소재 활용)
3. 외모, 나이, 체형, 성별, 질병을 놀리지 않는다.
4. 진단이나 치료 조언을 하지 않는다. '뼈 건강 한마디'는 예방 습관(스트레칭, 안전화, 귀마개, 낙상 주의 등)만 말한다.
5. 회사에 대해서는 [회사 배경]에 있는 내용만 사용한다. 매출·수치·실적·실존 인물 이름·구체적 사내 제도를 지어내지 않는다. 등장하는 동료는 '옆자리 선배', '품질팀 동료'처럼 이름 없이 부른다.
6. 존댓말, 밝은 톤. role_story를 뺀 나머지 항목은 짧게. 반드시 JSON으로만 답한다.`;

const COMPANY = `비엘테크(BL tech)는 강원도 춘천에 본사, 원주에 지사를 둔 회사다.
정형외과용 캐스트·부목(NEAL, SMILE 브랜드)과 하이드로겔 피부보호대 같은 의료기기, 산업용 보수재를 만든다.
일본·독일 등 해외 시장에도 제품을 공급한다. 사내에는 생산, 품질, R&D센터, 국내·해외 영업, 경영지원 등의 일이 있다.`;

const EXAMPLE = `{"bone":"쇄골(빗장뼈)","nickname":"부서 간 빗장","one_liner":"당신은 팀과 팀을 잇는 유일한 다리, 쇄골입니다!","personality":"쇄골이 팔과 몸통을 잇는 유일한 뼈 다리이듯, 당신 없이는 생산팀과 관리팀이 대화를 못 합니다. 메신저 알림이 가장 많이 울리는 사람, 바로 당신이죠.","fun_fact":"쇄골은 팔을 몸통에 연결하는 유일한 뼈 연결고리랍니다.","weakness":"모든 부담을 어깨로 받다가 쓰러질 수 있어요. 실제로도 넘어지며 어깨로 떨어질 때 쇄골 골절이 흔합니다.","guardian":"(여기에는 [보조기 안내]의 비엘테크 제품을 제품명 그대로 소개)","bone_tip":"오늘은 어깨를 뒤로 크게 10번 돌려주세요.","best_partner":"(여기에는 [다른 뼈 목록]에서 고른 뼈와 이유)","card_style":"팀과 팀을 잇는 유일한 다리","card_fact":"쇄골은 팔과 몸통을 잇는 유일한 뼈!","role_story":"(4문단 이야기)","role_strengths":["(강점1)","(강점2)","(강점3)"],"role_growth":"(성장 포인트)"}`;

export async function writeBoneResult(bone: Bone, role: Role, scores: Scores, dept?: Department): Promise<BoneWriting> {
  const others = BONES.filter((b) => b.id !== bone.id)
    .map((b) => `- ${b.name}: ${b.fact}`)
    .join("\n");

  const product = PRODUCTS[bone.product];
  const procedure = bone.procedure ? PROCEDURES[bone.procedure] : null;
  const procedureLine = procedure
    ? `\n이 부위를 고정하는 시술: ${procedure.name}(${procedure.ko}) — ${procedure.area} guardian에서 이 시술 이름을 한 번 언급해도 좋다.`
    : "";
  const deptLine =
    dept && dept !== "기타"
      ? `참가자의 소속: ${dept}. role_story의 장면은 이 부서의 업무 속에서 펼치고, 다른 부서와 협업하는 순간을 하나 넣는다.`
      : "참가자의 소속은 모른다. 특정 부서로 단정하지 말고, 여러 부서가 함께 움직이는 장면으로 그린다.";

  const user = `[뼈 데이터]
뼈: ${bone.name}
하는 일/반전 상식: ${bone.fact}
잘 다치는 상황: ${bone.injury}
지켜주는 보조기: ${bone.brace}

[보조기 안내]
지켜주는 보조기는 비엘테크 제품 '${product.name}'이다. 제품 특징: ${product.facts}
guardian은 반드시 '${product.name}'라는 제품명을 그대로 포함하고, 위 특징 중 하나를 골라 우리 회사가 만드는 제품이라는 자부심이 느껴지게 소개한다.
다른 회사 제품이나 비엘테크가 만들지 않는 보호 용품은 언급하지 않는다.${procedureLine}

[회사 속 역할 = 참가자의 업무 유형]: ${role.name} (${role.en}) — ${role.tagline}
역할의 본질: ${role.essence}
업무 성향 점수 (질문 ${QUESTIONS.length}개): ${TRAITS.map((t) => `${TRAIT_LABEL[t]} ${scores[t]}`).join(", ")}

[이 뼈를 닮은 이유] ${role.why}
role_story, role_strengths, role_growth는 이 역할을 중심으로 쓴다. ${deptLine}

[회사 배경]
${COMPANY}

[다른 뼈 목록] (best_partner는 여기서 고르고, 여기 적힌 사실만 쓸 것)
${others}

[결과 예시 — 쇄골/연결형. 톤과 길이만 참고하고 내용은 베끼지 말 것]
${EXAMPLE}

위 JSON 형식으로 작성해줘.`;

  const res = await getClient().responses.create({
    model: TEXT_MODEL,
    reasoning: { effort: TEXT_REASONING },
    instructions: SYSTEM,
    input: user,
    text: { format: { type: "json_schema", name: "bone_result", strict: true, schema: WRITING_SCHEMA } },
  });

  const out = JSON.parse(res.output_text) as BoneWriting;
  out.role_strengths = out.role_strengths.slice(0, 3);
  return out;
}

// ── 그림 ──────────────────────────────────────────

// 주의: "pixel"이라는 단어를 넣으면 픽셀아트 일러스트처럼 너무 잘 그려진다.
const STYLE = `Redraw the person (or animal) in the uploaded photo as if someone drew it in old MS Paint using only the mouse with the pencil/brush tool — a deliberately crude, 3-minute doodle by a non-artist.

Style rules:
- Wobbly, shaky mouse-drawn black lines, uneven thickness, lines overshoot and don't close, slightly off proportions
- Flat basic MS Paint palette colors with sloppy paint-bucket fills that leak past the lines a little or leave white gaps
- Simplified childish shapes: lopsided head, dot eyes, simple mouth, mitten hands
- Plain white background, no shading, no gradients, no realistic texture, no fine detail
- Absolutely NOT pixel art, NOT anime, NOT a polished illustration
- Keep recognizable features: hairstyle, glasses, clothing color, facial expression`;

const RULES = `Do NOT add any text, letters or numbers in the image.
Keep it friendly and silly. Never exaggerate weight, age, or facial flaws.`;

function bonePrompt(bone: Bone) {
  return `${STYLE}

Scene:
- The character is wearing a funny costume shaped like a ${bone.nameEn}
  (cartoon bone, white/ivory, cute — NOT an x-ray, NOT realistic anatomy, no blood)
- A small cartoon ${bone.nameEn} mascot with a face stands next to them, doing a high five
- The character is holding a ${bone.braceEn} like a trophy

${RULES}`;
}

function saferPrompt(bone: Bone) {
  return `${STYLE}

Scene:
- The character is smiling and wearing a cute white cartoon bone costume.
- A small smiling cartoon bone mascot stands next to them, doing a high five.
- The character holds a ${bone.braceEn} up proudly like a trophy.

${RULES}`;
}

export async function drawBonePortrait(image: Buffer, mimeType: string, bone: Bone): Promise<string> {
  try {
    return await editImage(image, mimeType, bonePrompt(bone));
  } catch (e) {
    // 안전 필터에 걸리면 표현을 순하게 바꿔 한 번 더 시도
    if (!(e instanceof APIError) || e.code !== "moderation_blocked") throw e;
    console.warn("moderation_blocked, retrying", bone.id);
    return await editImage(image, mimeType, saferPrompt(bone));
  }
}

async function editImage(image: Buffer, mimeType: string, prompt: string) {
  const result = await getClient().images.edit({
    model: IMAGE_MODEL,
    image: await toFile(image, mimeType === "image/png" ? "photo.png" : "photo.jpg", { type: mimeType }),
    prompt,
    size: "1024x1024",
    quality: IMAGE_QUALITY,
    output_format: "webp",
    output_compression: 92,
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("이미지 생성 결과가 비어 있습니다.");
  return `data:image/webp;base64,${b64}`;
}
