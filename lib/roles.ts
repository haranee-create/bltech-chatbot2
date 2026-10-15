/**
 * 업무 유형 테스트.
 * - 질문 10개, 각 선택지는 4가지 성향(지지·연결·돌파·섬세) 중 하나에 1점
 * - 점수로 회사 속 역할 10가지 중 하나를 정한다 (같은 답이면 항상 같은 유형)
 * - 역할마다 그 역할을 닮은 뼈(1~2개)가 있고, 결과의 뼈는 그중 하나
 */

export type Trait = "support" | "connect" | "breakthrough" | "detail";

export const TRAITS: Trait[] = ["support", "connect", "breakthrough", "detail"];

export const TRAIT_LABEL: Record<Trait, string> = {
  support: "지지",
  connect: "연결",
  breakthrough: "돌파",
  detail: "섬세",
};

export const TRAIT_DESC: Record<Trait, string> = {
  support: "묵묵히 받치고 끝까지 책임지는 힘",
  connect: "사람과 사람을 잇고 분위기를 살리는 힘",
  breakthrough: "결정하고 밀고 나가는 힘",
  detail: "준비하고 꼼꼼히 완성하는 힘",
};

export type Scores = Record<Trait, number>;

/** 받침 있으면 a, 없으면 b (예: 연결과 / 지지와) */
export function josa(word: string, a: string, b: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return word + (code >= 0 && code <= 11171 && code % 28 !== 0 ? a : b);
}

/** 핵심 질문 10개. 마지막 질문은 점수가 같을 때 결정권을 가진다 */
export const QUESTIONS: { q: string; options: { label: string; trait: Trait }[] }[] = [
  {
    q: "회의 시간에 나는?",
    options: [
      { label: "말은 적지만 다 듣고 있다", trait: "support" },
      { label: "분위기 메이커", trait: "connect" },
      { label: "결론부터 말한다", trait: "breakthrough" },
      { label: "회의록은 내가 쓴다", trait: "detail" },
    ],
  },
  {
    q: "새 프로젝트가 떨어졌다. 제일 먼저 하는 일은?",
    options: [
      { label: "목표와 마감부터 정한다", trait: "breakthrough" },
      { label: "자료부터 찾고 계획표를 만든다", trait: "detail" },
      { label: "내 몫을 확인하고 바로 손에 잡는다", trait: "support" },
      { label: "누구랑 같이 할지 사람부터 모은다", trait: "connect" },
    ],
  },
  {
    q: "동료들이 나를 찾는 순간은?",
    options: [
      { label: "다른 부서랑 말이 안 통할 때", trait: "connect" },
      { label: "숫자·서류가 맞는지 봐야 할 때", trait: "detail" },
      { label: "아무도 결정을 못 내리고 있을 때", trait: "breakthrough" },
      { label: "믿고 맡길 사람이 필요할 때", trait: "support" },
    ],
  },
  {
    q: "회의에서 의견이 팽팽하게 부딪치면?",
    options: [
      { label: "근거와 자료로 차분히 정리한다", trait: "detail" },
      { label: "팀이 정한 방향에 힘을 보탠다", trait: "support" },
      { label: "양쪽 이야기를 이어 절충안을 찾는다", trait: "connect" },
      { label: "결론을 내고 책임지고 간다", trait: "breakthrough" },
    ],
  },
  {
    q: "금요일 오후 5시 50분, 급한 일이 들어오면?",
    options: [
      { label: "묵묵히 처리", trait: "support" },
      { label: "동료를 불러 같이", trait: "connect" },
      { label: "월요일에 하자고 협상", trait: "breakthrough" },
      { label: "이미 예상하고 준비해둠", trait: "detail" },
    ],
  },
  {
    q: "일이 꼬였을 때 나는?",
    options: [
      { label: "원인을 끝까지 파고든다", trait: "detail" },
      { label: "될 때까지 묵묵히 한다", trait: "support" },
      { label: "판을 바꿔 다른 방법을 시도한다", trait: "breakthrough" },
      { label: "동료와 얘기하며 실마리를 찾는다", trait: "connect" },
    ],
  },
  {
    q: "가장 스트레스 받는 순간은?",
    options: [
      { label: "결정이 계속 미뤄질 때", trait: "breakthrough" },
      { label: "혼자 고립돼서 일할 때", trait: "connect" },
      { label: "준비 없이 갑자기 바뀔 때", trait: "detail" },
      { label: "맡은 일이 흐지부지될 때", trait: "support" },
    ],
  },
  {
    q: "가장 듣기 좋은 칭찬은?",
    options: [
      { label: "“같이 일해서 즐거웠어요”", trait: "connect" },
      { label: "“덕분에 든든했어요”", trait: "support" },
      { label: "“역시 꼼꼼하시네요”", trait: "detail" },
      { label: "“덕분에 확 풀렸어요”", trait: "breakthrough" },
    ],
  },
  {
    q: "나의 업무 에너지원은?",
    options: [
      { label: "커피", trait: "breakthrough" },
      { label: "간식", trait: "connect" },
      { label: "칭찬", trait: "detail" },
      { label: "퇴근", trait: "support" },
    ],
  },
  {
    q: "나를 한 단어로 표현하면?",
    options: [
      { label: "든든함", trait: "support" },
      { label: "친화력", trait: "connect" },
      { label: "추진력", trait: "breakthrough" },
      { label: "꼼꼼함", trait: "detail" },
    ],
  },
];

export type Role = {
  id: string;
  name: string; // 리더형
  en: string; // The Leader
  tagline: string; // 한 줄 소개
  essence: string; // 작문 모델에 넘기는 역할의 본질
  traits: [Trait] | [Trait, Trait];
  bones: string[]; // 이 역할을 닮은 뼈 (lib/bones.ts의 id)
  why: string; // 왜 이 뼈인지 (작문 모델에 넘기는 비유의 힌트)
};

export const ROLES: Role[] = [
  {
    id: "leader",
    name: "리더형",
    en: "The Leader",
    tagline: "방향을 정하고 사람을 모으는 사람",
    essence: "비전을 쉬운 말로 풀어 사람들을 모으고, 결정이 필요한 순간 앞에 서서 팀을 이끈다. 책임을 피하지 않는다.",
    traits: ["connect", "breakthrough"],
    bones: ["patella"],
    why: "슬개골이 허벅지 근육의 힘을 정강이로 전달해 무릎을 펴게 하듯, 팀의 힘을 모아 앞으로 일으켜 세운다.",
  },
  {
    id: "strategist",
    name: "전략가형",
    en: "The Strategist",
    tagline: "판을 읽고 한 수 앞을 두는 사람",
    essence: "상황과 숫자를 꼼꼼히 읽어 핵심을 짚고, 과감한 결론으로 연결한다. 남들이 못 본 리스크와 기회를 먼저 본다.",
    traits: ["breakthrough", "detail"],
    bones: ["distal-radius"],
    why: "요골이 손목을 돌리게 해주듯, 판의 방향을 돌려 판세를 바꾼다.",
  },
  {
    id: "executor",
    name: "실행가형",
    en: "The Driver",
    tagline: "정한 일은 끝까지 밀고 가는 사람",
    essence: "목표가 정해지면 묵묵하지만 강하게 밀어붙여 끝내 완수한다. 마감과 약속을 지키는 힘이 팀의 속도가 된다.",
    traits: ["support", "breakthrough"],
    bones: ["metatarsal"],
    why: "중족골이 반복 충격 속에서도 한 걸음씩 내딛게 하듯(그래서 행군골절이라는 별명도 있다), 끝까지 걸어 목표에 닿는다.",
  },
  {
    id: "coordinator",
    name: "조율자형",
    en: "The Coordinator",
    tagline: "모두가 함께 갈 수 있게 속도를 맞추는 사람",
    essence: "팀원 각자의 사정을 살피며 일정과 사람을 조율해 아무도 뒤처지지 않게 한다. 갈등을 부드럽게 풀어낸다.",
    traits: ["support", "connect"],
    bones: ["ulna"],
    why: "척골이 요골과 나란히 아래팔을 이루는 짝꿍이듯, 옆 사람과 보조를 맞추며 함께 움직인다.",
  },
  {
    id: "planner",
    name: "기획자형",
    en: "The Planner",
    tagline: "사람의 마음과 디테일을 함께 설계하는 사람",
    essence: "여러 사람의 의견을 모아 꼼꼼한 계획으로 엮어낸다. 행사·출시·프로젝트의 큰 그림과 작은 체크리스트를 동시에 쥔다.",
    traits: ["connect", "detail"],
    bones: ["metacarpal"],
    why: "중수골이 손목과 다섯 손가락을 잇는 손바닥의 뼈대이듯, 여러 갈래의 일을 하나의 계획으로 잇는 뼈대가 된다.",
  },
  {
    id: "steward",
    name: "살림꾼형",
    en: "The Steward",
    tagline: "보이지 않는 곳까지 챙기는 사람",
    essence: "일정, 재고, 서류, 안전까지 빈틈없이 챙겨 조직이 매일 문제없이 돌아가게 만든다. 티 나지 않지만 없으면 바로 티 나는 사람.",
    traits: ["support", "detail"],
    bones: ["talus", "fibula"],
    why: "거골은 근육 하나 없이 조용히 체중을 발로 전달하고, 비골은 체중은 적게 받지만 발목을 안정시킨다. 티 나지 않게 중심을 지킨다.",
  },
  {
    id: "anchor",
    name: "버팀목형",
    en: "The Anchor",
    tagline: "흔들리는 날에도 팀을 받치는 사람",
    essence: "말보다 결과로 신뢰를 쌓고, 위기 때 팀이 가장 먼저 기대는 사람. 꾸준함 자체가 실력이다.",
    traits: ["support"],
    bones: ["tibia", "femur"],
    why: "경골은 체중 대부분을 받치는 다리의 기둥이고, 대퇴골은 몸에서 가장 길고 강한 뼈다. 묵묵히 팀의 무게를 받친다.",
  },
  {
    id: "connector",
    name: "네트워커형",
    en: "The Connector",
    tagline: "사람과 사람 사이에 길을 내는 사람",
    essence: "부서와 부서, 사람과 사람을 이어 일이 막힘없이 흐르게 만든다. 분위기를 살리고 협업을 끌어낸다.",
    traits: ["connect"],
    bones: ["humerus"],
    why: "상완골이 어깨와 팔꿈치를 잇듯 사람과 사람을 잇는다. 팔꿈치를 부딪히면 찌릿한 그곳처럼, 가는 곳마다 반응이 온다.",
  },
  {
    id: "fixer",
    name: "해결사형",
    en: "The Fixer",
    tagline: "막힌 곳을 가장 먼저 뚫는 사람",
    essence: "문제가 생기면 가장 먼저 뛰어들어 결론을 낸다. 속도와 결단력이 무기이고, 위기에서 오히려 빛난다.",
    traits: ["breakthrough"],
    bones: ["calcaneus"],
    why: "종골이 걸을 때 첫 충격을 받아내듯, 문제가 터지면 가장 먼저 부딪혀 받아낸다.",
  },
  {
    id: "craftsman",
    name: "장인형",
    en: "The Craftsman",
    tagline: "디테일로 품질을 완성하는 사람",
    essence: "작은 차이를 놓치지 않고 완성도를 끝까지 끌어올린다. 기록과 준비가 습관이고, 그 결과물은 믿고 쓴다.",
    traits: ["detail"],
    bones: ["distal-phalanx", "scaphoid"],
    why: "손가락 끝마디뼈는 정교한 손작업을 맡고, 주상골은 작지만 손목의 핵심을 지킨다. 작은 것에서 완성도가 갈린다.",
  },
];

/** 이만큼 앞서면 한 가지 성향이 두드러진 '순수' 유형 */
const PURE_LEAD = Math.ceil(QUESTIONS.length * 0.4);

export const getRole = (id: string) => ROLES.find((r) => r.id === id);
export const roleOfBone = (boneId: string) => ROLES.find((r) => r.bones.includes(boneId));

/** 답 → 성향 점수 */
export function scoreAnswers(answers: Trait[]): Scores {
  const s: Scores = { support: 0, connect: 0, breakthrough: 0, detail: 0 };
  for (const a of answers) s[a] += 1;
  return s;
}

/**
 * 점수 → 역할.
 * 1위가 2위보다 문항 수의 40% 이상(10문항이면 4점) 앞서면 1위 성향의 '순수' 역할, 아니면 1·2위 성향을 짝지은 역할.
 * 점수가 같으면 마지막 질문(나를 한 단어로)에서 고른 성향이, 그다음엔 더 나중 질문에서 고른 성향이 앞선다.
 */
export function matchRole(answers: Trait[]): { role: Role; scores: Scores } {
  const scores = scoreAnswers(answers);
  const tie = answers[answers.length - 1];
  const ranked = [...TRAITS].sort(
    (a, b) =>
      scores[b] - scores[a] ||
      Number(b === tie) - Number(a === tie) ||
      answers.lastIndexOf(b) - answers.lastIndexOf(a) || // 그래도 같으면 더 최근에 고른 성향
      TRAITS.indexOf(a) - TRAITS.indexOf(b),
  );
  const [first, second] = ranked;
  const role =
    scores[first] - scores[second] >= PURE_LEAD
      ? ROLES.find((r) => r.traits.length === 1 && r.traits[0] === first)!
      : ROLES.find((r) => r.traits.length === 2 && r.traits.includes(first) && r.traits.includes(second))!;
  return { role, scores };
}

/** 역할을 닮은 뼈 중 하나 (재미로 랜덤) */
export function pickBoneId(role: Role): string {
  return role.bones[Math.floor(Math.random() * role.bones.length)];
}

/** 소속 부서 (선택). 고르면 역할 이야기가 그 부서의 업무 장면으로 쓰인다 */
export const DEPARTMENTS = ["생산", "품질", "연구개발(R&D)", "국내 영업·마케팅", "해외 영업", "경영지원", "기타"] as const;
export type Department = (typeof DEPARTMENTS)[number];
