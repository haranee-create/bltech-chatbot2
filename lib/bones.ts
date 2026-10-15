/**
 * 뼈BTI 데이터 시트.
 * 작문 모델은 여기 적힌 사실만 사용합니다 (의학 지식을 지어내지 않도록).
 * `brace` 칸은 비엘테크 실제 제품명으로 바꿔 쓰세요. `braceEn`은 그림에 그릴 소품(영어)입니다.
 */

export type BoneType = "support" | "connect" | "breakthrough" | "detail";

export const TYPE_LABEL: Record<BoneType, string> = {
  support: "지지형",
  connect: "연결형",
  breakthrough: "돌파형",
  detail: "섬세형",
};

export type Bone = {
  id: string;
  type: BoneType;
  name: string; // 한국어 이름 (괄호 속 우리말 포함)
  short: string; // 카드에 넣을 짧은 이름
  nameEn: string; // 그림 프롬프트용
  fact: string; // 하는 일 / 반전 상식
  injury: string; // 잘 다치는 상황
  brace: string; // 지켜주는 보조기 (자사 제품명으로 수정)
  braceEn: string; // 그림 속 트로피처럼 든 소품
};

export const BONES: Bone[] = [
  // ── 지지형
  {
    id: "femur",
    type: "support",
    name: "대퇴골(넓적다리뼈)",
    short: "대퇴골",
    nameEn: "femur (thigh bone)",
    fact: "몸에서 가장 길고 강한 뼈. 키의 약 1/4",
    injury: "고령자 낙상 시 대퇴골 경부 골절",
    brace: "고관절 보호대, 하지 부목",
    braceEn: "padded hip protector",
  },
  {
    id: "tibia",
    type: "support",
    name: "경골(정강이뼈)",
    short: "경골",
    nameEn: "tibia (shin bone)",
    fact: "체중 대부분을 받치는 다리의 기둥. 피부 바로 아래라 부딪히면 유독 아픔",
    injury: "책상 모서리, 축구",
    brace: "하지 부목, 정강이 보호대",
    braceEn: "shin guard",
  },
  {
    id: "lumbar",
    type: "support",
    name: "요추(허리뼈)",
    short: "요추",
    nameEn: "lumbar vertebra (lower back bone)",
    fact: "5개. 상체 무게를 떠받치는 허리의 중심",
    injury: "무거운 물건을 허리로 들 때",
    brace: "요추 보조기",
    braceEn: "lumbar back support brace",
  },
  {
    id: "calcaneus",
    type: "support",
    name: "종골(발뒤꿈치뼈)",
    short: "종골",
    nameEn: "calcaneus (heel bone)",
    fact: "발목 아래 뼈 중 가장 큼. 걸을 때 첫 충격을 받음",
    injury: "높은 곳에서 떨어질 때",
    brace: "발 보조기, 하지 부목",
    braceEn: "foot orthosis brace",
  },
  // ── 연결형
  {
    id: "clavicle",
    type: "connect",
    name: "쇄골(빗장뼈)",
    short: "쇄골",
    nameEn: "clavicle (collarbone)",
    fact: "팔을 몸통에 연결하는 유일한 뼈 다리",
    injury: "넘어지며 어깨로 떨어질 때",
    brace: "쇄골 밴드(8자 붕대), 팔걸이",
    braceEn: "figure-eight clavicle brace",
  },
  {
    id: "scapula",
    type: "connect",
    name: "견갑골(어깨뼈)",
    short: "견갑골",
    nameEn: "scapula (shoulder blade)",
    fact: "약 17개 근육이 붙는 근육들의 허브",
    injury: "어깨 과사용, 반복 동작",
    brace: "어깨 보조기",
    braceEn: "shoulder support brace",
  },
  {
    id: "hyoid",
    type: "connect",
    name: "설골(목뿔뼈)",
    short: "설골",
    nameEn: "hyoid bone",
    fact: "다른 뼈와 관절을 이루지 않는 유일한 뼈. 말하고 삼키는 데 관여",
    injury: "거의 다치지 않음 (독립적 존재)",
    brace: "해당 없음 — \"자유로운 영혼\"",
    braceEn: "small golden trophy cup",
  },
  {
    id: "rib",
    type: "connect",
    name: "늑골(갈비뼈)",
    short: "늑골",
    nameEn: "rib",
    fact: "12쌍. 심장과 폐를 감싸는 보호막",
    injury: "부딪힘. 골절되면 웃거나 기침할 때 아픔",
    brace: "늑골 밴드",
    braceEn: "rib support belt",
  },
  // ── 돌파형
  {
    id: "distal-radius",
    type: "breakthrough",
    name: "요골 원위부(손목 쪽 아래팔뼈)",
    short: "요골",
    nameEn: "radius (forearm bone near the wrist)",
    fact: "손목을 돌리게 해주는 뼈",
    injury: "넘어지며 손을 짚을 때 (빙판 주의)",
    brace: "손목 부목, 단상지 스플린트",
    braceEn: "wrist splint",
  },
  {
    id: "metatarsal",
    type: "breakthrough",
    name: "중족골(발등뼈)",
    short: "중족골",
    nameEn: "metatarsal (foot bone)",
    fact: "발가락과 발목을 잇는 5개의 뼈",
    injury: "반복 충격에 의한 피로골절(일명 행군골절)",
    brace: "발 보조기, 깁스 신발",
    braceEn: "orthopedic cast shoe",
  },
  {
    id: "fibula",
    type: "breakthrough",
    name: "비골(종아리뼈)",
    short: "비골",
    nameEn: "fibula (calf bone)",
    fact: "체중은 적게 받지만 발목 안정에 중요. 뼈 이식용으로 쓰이기도 함",
    injury: "발목 접질림과 함께 골절",
    brace: "발목 보조기",
    braceEn: "ankle brace",
  },
  {
    id: "skull",
    type: "breakthrough",
    name: "두개골",
    short: "두개골",
    nameEn: "skull (cute cartoon cranium, friendly, not spooky)",
    fact: "22개 뼈가 합쳐진 헬멧",
    injury: "머리 부딪힘",
    brace: "안전모 (보조기보다 예방!)",
    braceEn: "yellow safety hard hat",
  },
  // ── 섬세형
  {
    id: "scaphoid",
    type: "detail",
    name: "주상골(손배뼈)",
    short: "주상골",
    nameEn: "scaphoid (small wrist bone)",
    fact: "손목 엄지 쪽 작은 뼈. 손목뼈 골절 중 가장 흔하고 혈액 공급이 약해 회복이 느림",
    injury: "손을 짚고 넘어질 때. 엑스레이에 잘 안 보이기도 함",
    brace: "엄지 스파이카 부목",
    braceEn: "thumb spica splint",
  },
  {
    id: "distal-phalanx",
    type: "detail",
    name: "손가락 끝마디뼈",
    short: "손가락 끝마디뼈",
    nameEn: "fingertip bone (distal phalanx)",
    fact: "정교한 손작업 담당",
    injury: "손가락 끝에 공을 맞아 생기는 망치손가락",
    brace: "손가락 스플린트",
    braceEn: "finger splint",
  },
  {
    id: "stapes",
    type: "detail",
    name: "등골(귀 속 뼈)",
    short: "등골",
    nameEn: "stapes (tiny stirrup-shaped ear bone)",
    fact: "인체에서 가장 작은 뼈(약 3mm). 소리를 전달",
    injury: "뼈 자체보다 귀가 소음에 약함",
    brace: "귀마개 (공장 필수!)",
    braceEn: "pair of foam earplugs",
  },
  {
    id: "cervical",
    type: "detail",
    name: "경추(목뼈)",
    short: "경추",
    nameEn: "cervical vertebra (neck bone)",
    fact: "7개. 사람도 기린도 목뼈는 7개",
    injury: "거북목, 장시간 모니터 업무",
    brace: "경추 보조기",
    braceEn: "cervical neck collar brace",
  },
  {
    id: "coccyx",
    type: "detail",
    name: "미골(꼬리뼈)",
    short: "꼬리뼈",
    nameEn: "coccyx (tailbone)",
    fact: "꼬리의 흔적. 앉을 때 체중 일부를 받음",
    injury: "엉덩방아",
    brace: "도넛 방석",
    braceEn: "donut-shaped seat cushion",
  },
];

/** 질문 3개. 각 선택지는 유형 하나에 표를 던진다. */
export const QUESTIONS: { q: string; options: { label: string; type: BoneType }[] }[] = [
  {
    q: "회의 시간에 나는?",
    options: [
      { label: "말은 적지만 다 듣고 있다", type: "support" },
      { label: "분위기 메이커", type: "connect" },
      { label: "결론부터 말한다", type: "breakthrough" },
      { label: "회의록은 내가 쓴다", type: "detail" },
    ],
  },
  {
    q: "금요일 오후 5시 50분, 급한 일이 들어오면?",
    options: [
      { label: "묵묵히 처리", type: "support" },
      { label: "동료를 불러 같이", type: "connect" },
      { label: "월요일에 하자고 협상", type: "breakthrough" },
      { label: "이미 예상하고 준비해둠", type: "detail" },
    ],
  },
  {
    q: "나의 업무 에너지원은?",
    options: [
      { label: "커피", type: "breakthrough" },
      { label: "간식", type: "connect" },
      { label: "칭찬", type: "detail" },
      { label: "퇴근", type: "support" },
    ],
  },
];

export const BONE_TYPES = Object.keys(TYPE_LABEL) as BoneType[];

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** 가장 많이 나온 유형(동점이면 랜덤) → 그 유형의 뼈 풀에서 랜덤 1개 */
export function matchBone(answers: BoneType[]): Bone {
  const count = new Map<BoneType, number>();
  for (const a of answers) count.set(a, (count.get(a) ?? 0) + 1);
  const max = Math.max(...count.values());
  const top = [...count.entries()].filter(([, n]) => n === max).map(([t]) => t);
  const type = pick(top);
  return pick(BONES.filter((b) => b.type === type));
}
