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
};

export type BoneInfo = {
  id: string;
  type: BoneType;
  typeLabel: string;
  name: string;
  short: string;
  injury: string;
  brace: string;
};

export type GenerateResponse = {
  bone: BoneInfo;
  writing: BoneWriting;
  image: string; // data URL
};

export type ShareMeta = {
  short: string;
  name: string;
  typeLabel: string;
  nickname: string;
  one_liner: string;
  personality: string;
  fun_fact: string;
};
