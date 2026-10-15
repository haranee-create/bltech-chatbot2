import type { BoneType } from "./bones";

/** 작문 모델(gpt-5.6-terra)이 돌려주는 결과 */
export type BoneWriting = {
  bone: string;
  nickname: string;
  one_liner: string;
  personality: string;
  fun_fact: string;
  weakness: string;
  guardian: string;
  bone_tip: string;
  best_partner: string;
  card_style: string; // 공유 카드용 '일하는 스타일' 요약
  card_fact: string; // 공유 카드용 '뼈 상식' 요약
  role_story: string; // 회사 속 나의 역할 이야기 (4문단)
  role_strengths: string[]; // 강점 3개
  role_growth: string; // 성장 포인트
};

export type BoneInfo = {
  id: string;
  type: BoneType;
  typeLabel: string;
  name: string;
  short: string;
  en: string; // SCAPHOID
  injury: string;
  brace: string;
};

export type RoleInfo = {
  id: string;
  name: string;
  en: string;
  tagline: string;
};

export type GenerateResponse = {
  bone: BoneInfo;
  role: RoleInfo;
  writing: BoneWriting;
  image: string; // data URL
};

export type ShareMeta = {
  boneId: string;
  roleId: string;
  short: string;
  name: string;
  typeLabel: string;
  nickname: string;
  one_liner: string;
  personality: string;
  fun_fact: string;
  role_story: string;
};
