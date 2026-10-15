import type { BoneType } from "./bones";

/**
 * 회사 속 나의 역할 10가지.
 * 질문 3개의 답 조합으로 정한다: 주 유형(뼈를 정한 유형) + 보조 유형.
 * - 세 답이 모두 같은 유형이면 그 유형의 '순수' 역할
 * - 아니면 주 유형과, 나머지 답 중 하나의 유형을 짝지은 역할
 */
export type Role = {
  id: string;
  name: string; // 리더형
  en: string; // The Leader
  tagline: string; // 한 줄 소개
  essence: string; // 작문 모델에 넘기는 역할의 본질
  types: [BoneType] | [BoneType, BoneType];
};

export const ROLES: Role[] = [
  {
    id: "leader",
    name: "리더형",
    en: "The Leader",
    tagline: "방향을 정하고 사람을 모으는 사람",
    essence: "비전을 쉬운 말로 풀어 사람들을 모으고, 결정이 필요한 순간 앞에 서서 팀을 이끈다. 책임을 피하지 않는다.",
    types: ["connect", "breakthrough"],
  },
  {
    id: "strategist",
    name: "전략가형",
    en: "The Strategist",
    tagline: "판을 읽고 한 수 앞을 두는 사람",
    essence: "상황과 숫자를 꼼꼼히 읽어 핵심을 짚고, 과감한 결론으로 연결한다. 남들이 못 본 리스크와 기회를 먼저 본다.",
    types: ["breakthrough", "detail"],
  },
  {
    id: "executor",
    name: "실행가형",
    en: "The Driver",
    tagline: "정한 일은 끝까지 밀고 가는 사람",
    essence: "목표가 정해지면 묵묵하지만 강하게 밀어붙여 끝내 완수한다. 마감과 약속을 지키는 힘이 팀의 속도가 된다.",
    types: ["support", "breakthrough"],
  },
  {
    id: "coordinator",
    name: "조율자형",
    en: "The Coordinator",
    tagline: "모두가 함께 갈 수 있게 속도를 맞추는 사람",
    essence: "팀원 각자의 사정을 살피며 일정과 사람을 조율해 아무도 뒤처지지 않게 한다. 갈등을 부드럽게 풀어낸다.",
    types: ["support", "connect"],
  },
  {
    id: "planner",
    name: "기획자형",
    en: "The Planner",
    tagline: "사람의 마음과 디테일을 함께 설계하는 사람",
    essence: "여러 사람의 의견을 모아 꼼꼼한 계획으로 엮어낸다. 행사·출시·프로젝트의 큰 그림과 작은 체크리스트를 동시에 쥔다.",
    types: ["connect", "detail"],
  },
  {
    id: "steward",
    name: "살림꾼형",
    en: "The Steward",
    tagline: "보이지 않는 곳까지 챙기는 사람",
    essence: "일정, 재고, 서류, 안전까지 빈틈없이 챙겨 조직이 매일 문제없이 돌아가게 만든다. 티 나지 않지만 없으면 바로 티 나는 사람.",
    types: ["support", "detail"],
  },
  {
    id: "anchor",
    name: "버팀목형",
    en: "The Anchor",
    tagline: "흔들리는 날에도 팀을 받치는 사람",
    essence: "말보다 결과로 신뢰를 쌓고, 위기 때 팀이 가장 먼저 기대는 사람. 꾸준함 자체가 실력이다.",
    types: ["support"],
  },
  {
    id: "connector",
    name: "네트워커형",
    en: "The Connector",
    tagline: "사람과 사람 사이에 길을 내는 사람",
    essence: "부서와 부서, 사람과 사람을 이어 일이 막힘없이 흐르게 만든다. 분위기를 살리고 협업을 끌어낸다.",
    types: ["connect"],
  },
  {
    id: "fixer",
    name: "해결사형",
    en: "The Fixer",
    tagline: "막힌 곳을 가장 먼저 뚫는 사람",
    essence: "문제가 생기면 가장 먼저 뛰어들어 결론을 낸다. 속도와 결단력이 무기이고, 위기에서 오히려 빛난다.",
    types: ["breakthrough"],
  },
  {
    id: "craftsman",
    name: "장인형",
    en: "The Craftsman",
    tagline: "디테일로 품질을 완성하는 사람",
    essence: "작은 차이를 놓치지 않고 완성도를 끝까지 끌어올린다. 기록과 준비가 습관이고, 그 결과물은 믿고 쓴다.",
    types: ["detail"],
  },
];

export const getRole = (id: string) => ROLES.find((r) => r.id === id);

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** 주 유형 + 나머지 답에서 보조 유형을 골라 역할을 정한다 */
export function matchRole(answers: BoneType[], primary: BoneType): Role {
  const others = answers.filter((a) => a !== primary);
  if (others.length === 0) return ROLES.find((r) => r.types.length === 1 && r.types[0] === primary)!;

  const count = new Map<BoneType, number>();
  for (const a of others) count.set(a, (count.get(a) ?? 0) + 1);
  const max = Math.max(...count.values());
  const secondary = pick([...count.entries()].filter(([, n]) => n === max).map(([t]) => t));
  return ROLES.find((r) => r.types.length === 2 && r.types.includes(primary) && r.types.includes(secondary))!;
}

/** 소속 부서 (선택). 고르면 역할 이야기가 그 부서의 업무 장면으로 쓰인다 */
export const DEPARTMENTS = ["생산", "품질", "연구개발(R&D)", "국내 영업·마케팅", "해외 영업", "경영지원", "기타"] as const;
export type Department = (typeof DEPARTMENTS)[number];
