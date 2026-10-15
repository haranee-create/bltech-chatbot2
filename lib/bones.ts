/**
 * 뼈BTI 데이터 시트.
 * 작문 모델은 여기 적힌 사실만 사용합니다 (의학 지식을 지어내지 않도록).
 * 모든 뼈는 그 뼈를 지켜주는 비엘테크 제품(PRODUCTS)과, 그 부위를 고정하는 시술(PROCEDURES)과 짝지어져 있습니다.
 * - 제품 특징·사용법: www.bl-tech.co.kr 제품 소개 기준
 * - 시술 영상: 비엘테크 공식 유튜브(@bltechco.ltd.2093) / 홈페이지 '시술 영상'
 * `braceEn`은 그림에 그릴 소품(영어)입니다.
 */

export type BoneType = "support" | "connect" | "breakthrough" | "detail";

export const TYPE_LABEL: Record<BoneType, string> = {
  support: "지지형",
  connect: "연결형",
  breakthrough: "돌파형",
  detail: "섬세형",
};

const SITE = "https://www.bl-tech.co.kr";
export const YOUTUBE_CHANNEL = "https://www.youtube.com/@bltechco.ltd.2093";

export type Product = {
  name: string;
  kind: string; // 한눈에 보는 분류
  facts: string; // 작문 모델에 넘기는 제품 특징
  howTo: string; // 화면에 보여줄 사용법 (홈페이지 내용 기준)
  url: string; // 홈페이지 제품 페이지
};

/** 비엘테크 제품 (www.bl-tech.co.kr 제품 소개에 나온 사실만) */
export const PRODUCTS = {
  "splint-f-plus": {
    name: "NEAL Splint F PLUS",
    kind: "유리섬유 롤 부목",
    facts:
      "독자 기술의 1겹 유리섬유 기재로 타사 대비 가볍고 강도가 우수한 반고정형 경질 부목. 피부 접촉면은 두껍고 부드러운 부직포라 장시간 착용에도 부담이 적음",
    howTo:
      "필요한 길이만큼 잘라 물에 적신 뒤 환부에 대고 모양을 잡으면 단단하게 굳어요. 남은 부목은 밀봉해 두었다가 다시 쓸 수 있어요.",
    url: `${SITE}/main/sub2_1_2_1_1.php`,
  },
  "splint-n-plus": {
    name: "NEAL Splint N PLUS",
    kind: "부직포 롤 부목",
    facts:
      "경화 후 찔림이 없는 부직포 기재의 초경량 부목. 날카로운 절단면이 생기지 않고 유리섬유로 인한 피부 알러지를 방지. 부드럽고 유연해 쉽고 정밀한 몰딩 가능",
    howTo:
      "필요한 길이만큼 잘라 물에 적신 뒤 환부에 대고 모양을 잡아요. 잘라도 날카로운 단면이 생기지 않아 작은 부위도 섬세하게 맞출 수 있어요.",
    url: `${SITE}/main/sub2_1_2_2_1.php`,
  },
  "splint-fg": {
    name: "SMILE Splint FG",
    kind: "유리섬유 롤 부목 (패딩 탈착형)",
    facts:
      "유리섬유 기재와 피부보호용 패딩으로 이루어진 반고정형 경질 부목. 상·하부 패딩을 분리·재부착할 수 있어 환자 상태에 맞춘 세심한 재단이 가능. 1겹 유리섬유 기재로 가볍고 강도가 우수",
    howTo:
      "패딩을 떼었다 붙였다 하며 환자에게 맞게 재단한 뒤, 물에 적셔 환부에 대고 모양을 잡아요.",
    url: `${SITE}/main/sub2_1_2_1_2.php`,
  },
  "splint-sp": {
    name: "SMILE Splint SP",
    kind: "차세대 롤 부목",
    facts:
      "유리섬유 수준의 강도에 피부 자극·분진·알러지가 없는 차세대 스프린트. 절단 시 날카로운 모서리가 없고 섬세한 몰딩 가능. 일본 시장 브랜드 점유율 1위",
    howTo:
      "잘라서 물에 적신 뒤 환부에 대고 모양을 잡아요. 패딩이 양면 접합 구조라 재단과 위치 조정이 자유롭고, 잘라도 분진이나 날카로운 모서리가 없어요.",
    url: `${SITE}/main/sub2_1_2_3_1.php`,
  },
  "pre-mold": {
    name: "NEAL Pre-mold Splint",
    kind: "미리 성형된 부목 + 벨크로",
    facts:
      "이미 성형되어 있는 정형외과용 부목. 압박 붕대 없이 벨크로로 빠르게 고정해 응급 처치에 적합. 경화 후에도 날카로운 모서리가 생기지 않는 부직포 지지체. Short Arm·Sugar Tong·Long Arm·Short Leg·Long Leg 등 다양한 규격",
    howTo:
      "이미 모양이 잡혀 있는 부목을 환부에 대고 벨크로로 고정해요. 압박 붕대가 필요 없어 초보자도 빠르게 쓸 수 있어 응급 처치에 좋아요.",
    url: `${SITE}/main/sub2_1_2_4_1.php`,
  },
  "cast-plus": {
    name: "NEAL Cast PLUS",
    kind: "캐스팅 테이프 (깁스)",
    facts:
      "끈적임 적은 수경화성 레진과 직접 직조한 프리미엄 원단으로 만든 글로벌 스탠다드 캐스트(깁스 테이프). 캐스트 쏘로 제거가 쉽고 타사 대비 가벼운 중량",
    howTo:
      "물에 적신 테이프를 환부에 감으면 굳어서 단단한 캐스트(깁스)가 돼요. 끈적임이 적어 몰딩이 매끄럽고, 나중에 캐스트 쏘로 쉽게 제거해요.",
    url: `${SITE}/main/sub2_1_1_1_1.php`,
  },
  "cast-alpha": {
    name: "NEAL Cast ALPHA",
    kind: "캐스팅 테이프 (깁스)",
    facts:
      "층간 접착력이 탁월한 유리섬유 캐스트로 견고한 몰딩과 강한 고정이 특징. 수분과 반응하면 미끄러운 촉감이 되어 유연한 몰딩이 가능하고, 여러 겹을 감아도 단단하게 고정됨",
    howTo:
      "물에 적시면 미끄러운 촉감이 되어 매끄럽게 감기고, 여러 겹을 감아도 층끼리 단단히 붙어 들뜨지 않는 캐스트가 돼요.",
    url: `${SITE}/main/sub2_1_1_1_2.php`,
  },
  "cast-premium": {
    name: "SMILE Cast PREMIUM",
    kind: "프리미엄 캐스팅 테이프",
    facts:
      "비엘테크 독자 직조 기술로 기존 대비 약 10% 더 가볍고 강도는 더 높은 프리미엄 캐스트. 타사 68Tex보다 얇은 50Tex 유리섬유를 직접 직조하고, 날카로운 모서리를 줄여 2차 부상 위험을 낮춤. 유럽·일본 등 글로벌 시장에서 경쟁력 입증",
    howTo:
      "물에 적셔 환부에 감아 캐스트를 만들어요. 얇은 50Tex 원단이라 가볍고 부드럽게 감기며, 모서리가 덜 날카로워요.",
    url: `${SITE}/main/sub2_1_1_1_3.php`,
  },
  "cast-soft": {
    name: "NEAL Cast SOFT",
    kind: "반경질 캐스팅 테이프",
    facts:
      "가위로 쉽게 제거할 수 있는 반경질형 캐스트. 캐스트 쏘에 거부감이 있는 환자에게도 부담 없이 적용. 감는 겹수로 지지력을 조절할 수 있고, 완전히 굳은 뒤에도 반경질이라 어느 정도 움직임을 허용. 리지드 캐스트와 병용하면 편안한 맞춤 고정 가능",
    howTo:
      "감는 겹수로 지지력을 조절하며 감아요. 굳은 뒤에도 반경질이라 손이나 밴디지 가위로 쉽게 풀 수 있어요. Core Splint와 함께 쓰면 떼었다 붙이는 캐스트도 만들 수 있어요.",
    url: `${SITE}/main/sub2_1_1_2_1.php`,
  },
  hydrogel: {
    name: "비엘테크 하이드로겔 피부보호대",
    kind: "의료기기 1등급 하이드로겔 패치 (신제품)",
    facts:
      "비엘테크 신제품. TDS(Transdermal Delivery System) 기술을 활용한 의료기기 1등급 하이드로겔 피부보호대. 생체적합성 시험을 통과해 안전성이 검증됨. 특허받은 고분자 하이드로겔로 민감한 피부에도 자극 없이 부착 가능. (뼈가 아니라 피부를 보호하는 제품이므로 뼈를 고정하거나 치료한다고 말하지 말 것)",
    howTo:
      "피부에 붙여 피부를 보호하는 패치예요. 특허받은 고분자 하이드로겔이라 민감한 피부에도 자극 없이 붙어요.",
    url: `${SITE}/main/sub2_2_1_1.php`,
  },
} satisfies Record<string, Product>;

export type ProductId = keyof typeof PRODUCTS;

/** 시술(고정 방법). area는 그 시술이 감싸는 부위. 영상은 비엘테크 공식 유튜브 */
export type Procedure = {
  name: string;
  ko: string;
  area: string;
  video: { id: string; title: string };
};

export const PROCEDURES = {
  "long-leg-splint": {
    name: "Long Leg Splint",
    ko: "긴 다리 부목",
    area: "허벅지부터 발까지 다리 뒤쪽에 부목을 대어 무릎과 발목을 함께 고정해요.",
    video: { id: "GgzGHXi1208", title: "닐 스프린트 Long Leg 시술" },
  },
  "long-leg-splint-en": {
    name: "Long Leg Splint",
    ko: "긴 다리 부목",
    area: "허벅지부터 발까지 다리 뒤쪽에 부목을 대어 무릎과 발목을 함께 고정해요.",
    video: { id: "Z6YaAE3m9F8", title: "[APPLICATION VIDEO] LONG LEG SPLINT" },
  },
  "short-leg-splint": {
    name: "Short Leg Splint",
    ko: "짧은 다리 부목",
    area: "무릎 아래 종아리 뒤쪽부터 발바닥까지 부목을 대어 발목을 고정해요.",
    video: { id: "JPN6g_xkEsw", title: "[APPLICATION VIDEO] SHORT LEG SPLINT" },
  },
  "reinforced-posterior-leg-splint": {
    name: "Reinforced Posterior Leg Splint",
    ko: "보강형 다리 뒤쪽 부목",
    area: "다리 뒤쪽 부목을 SMILE Splint로 보강해 발목을 단단히 잡아줘요. 발뒤꿈치와 복사뼈가 눌리지 않게 재단하는 것이 포인트예요.",
    video: { id: "qTTMno9ZGPY", title: "Reinforced Posterior Leg Splint 시술" },
  },
  "short-leg-cast": {
    name: "Short Leg Cast",
    ko: "짧은 다리 캐스트",
    area: "무릎 아래부터 발까지 종아리·발목·발을 캐스트로 감싸 고정해요.",
    video: { id: "L9bh5Fdbzns", title: "닐 캐스트 Short Leg 시술" },
  },
  "short-leg-cast-smile": {
    name: "Short Leg Cast",
    ko: "짧은 다리 캐스트",
    area: "무릎 아래부터 발까지 종아리·발목·발을 캐스트로 감싸 고정해요.",
    video: { id: "XmKj-0O5_t4", title: "스마일 캐스트 Short Leg 시술" },
  },
  "long-arm-splint": {
    name: "Long Arm Splint",
    ko: "긴 팔 부목",
    area: "위팔부터 손까지 부목을 대어 팔꿈치를 구부린 채로 고정해요.",
    video: { id: "1QDO2sIkY2M", title: "닐 스프린트 Long Arm 시술" },
  },
  "reverse-sugar-tong": {
    name: "Reverse Sugar Tong Splint",
    ko: "리버스 슈가텅 부목",
    area: "설탕 집게처럼 U자로 구부린 부목으로 팔꿈치를 감싸 아래팔을 앞뒤에서 잡아주는 시술을, SMILE Splint로 응용한 비엘테크 시술이에요.",
    video: { id: "3yE0dxgCzr4", title: "Reverse Sugar Tong Splint 시술" },
  },
  "short-arm-cast": {
    name: "Short Arm Cast",
    ko: "짧은 팔 캐스트",
    area: "손바닥부터 팔꿈치 아래까지 손목과 아래팔을 캐스트로 감싸 고정해요.",
    video: { id: "NSmQFnokFBg", title: "닐 캐스트 Short Arm 시술" },
  },
  "short-arm-splint": {
    name: "Short Arm Splint",
    ko: "짧은 팔 부목",
    area: "손바닥부터 팔꿈치 아래까지 부목을 대어 손과 손목을 받쳐 고정해요.",
    video: { id: "geyk_HOcr1o", title: "[APPLICATION VIDEO] SHORT ARM SPLINT" },
  },
  "removable-cast": {
    name: "Removable Cast",
    ko: "탈착식 캐스트",
    area: "NEAL Cast SOFT와 Core Splint로 아래팔부터 엄지까지 감싸, 떼었다 다시 착용할 수 있게 만드는 비엘테크 시술이에요.",
    video: { id: "zobSY-J3-Z4", title: "Removable Cast 시술" },
  },
} satisfies Record<string, Procedure>;

export type ProcedureId = keyof typeof PROCEDURES;

export type Bone = {
  id: string;
  type: BoneType;
  name: string; // 한국어 이름 (괄호 속 우리말 포함)
  short: string; // 카드에 넣을 짧은 이름
  nameEn: string; // 그림 프롬프트용
  fact: string; // 하는 일 / 반전 상식
  injury: string; // 잘 다치는 상황
  product: ProductId; // 지켜주는 비엘테크 제품
  brace: string; // 카드에 표시할 제품명 (규격·용도)
  procedure?: ProcedureId; // 이 부위를 고정하는 시술 (영상 포함)
  braceEn: string; // 그림 속 트로피처럼 든 소품
};

const CAST_EN = "bright colorful roll of orthopedic casting tape";
const SPLINT_EN = "padded orthopedic splint";

export const BONES: Bone[] = [
  // ── 지지형: 묵묵히 체중을 받치는 뼈
  {
    id: "femur",
    type: "support",
    name: "대퇴골(넓적다리뼈)",
    short: "대퇴골",
    nameEn: "femur (thigh bone)",
    fact: "몸에서 가장 길고 강한 뼈. 키의 약 1/4",
    injury: "고령자 낙상 시 대퇴골 경부 골절",
    product: "splint-f-plus",
    brace: "NEAL Splint F PLUS",
    procedure: "long-leg-splint",
    braceEn: SPLINT_EN,
  },
  {
    id: "tibia",
    type: "support",
    name: "경골(정강이뼈)",
    short: "경골",
    nameEn: "tibia (shin bone)",
    fact: "체중 대부분을 받치는 다리의 기둥. 피부 바로 아래라 부딪히면 유독 아픔",
    injury: "책상 모서리, 축구",
    product: "hydrogel",
    brace: "하이드로겔 피부보호대 (신제품)",
    braceEn: "soft translucent hydrogel skin patch",
  },
  {
    id: "calcaneus",
    type: "support",
    name: "종골(발뒤꿈치뼈)",
    short: "종골",
    nameEn: "calcaneus (heel bone)",
    fact: "발목 아래 뼈 중 가장 큼. 걸을 때 첫 충격을 받음",
    injury: "높은 곳에서 떨어질 때",
    product: "splint-fg",
    brace: "SMILE Splint FG",
    procedure: "reinforced-posterior-leg-splint",
    braceEn: SPLINT_EN,
  },
  {
    id: "talus",
    type: "support",
    name: "거골(목말뼈)",
    short: "거골",
    nameEn: "talus (ankle bone)",
    fact: "다리의 체중을 발로 전달하는 발목 관절의 중심 뼈. 근육이 하나도 붙어 있지 않은 특이한 뼈",
    injury: "높은 곳에서 떨어지거나 발목이 심하게 꺾일 때",
    product: "cast-alpha",
    brace: "NEAL Cast ALPHA",
    procedure: "short-leg-cast",
    braceEn: CAST_EN,
  },
  // ── 연결형: 이것과 저것을 잇는 뼈
  {
    id: "ulna",
    type: "connect",
    name: "척골(자뼈)",
    short: "척골",
    nameEn: "ulna (forearm bone)",
    fact: "요골과 나란히 아래팔을 이루는 짝꿍 뼈. 팔꿈치를 짚으면 만져지는 뾰족한 끝이 바로 척골",
    injury: "넘어지며 손을 짚을 때 요골과 함께 다치기 쉬움",
    product: "splint-sp",
    brace: "SMILE Splint SP",
    procedure: "reverse-sugar-tong",
    braceEn: SPLINT_EN,
  },
  {
    id: "humerus",
    type: "connect",
    name: "상완골(위팔뼈)",
    short: "상완골",
    nameEn: "humerus (upper arm bone)",
    fact: "어깨와 팔꿈치를 잇는 위팔의 뼈. 팔꿈치를 부딪혔을 때 찌릿한 곳은 뼈가 아니라 상완골 옆을 지나는 신경",
    injury: "넘어지며 팔을 짚거나 팔꿈치로 떨어질 때",
    product: "splint-f-plus",
    brace: "NEAL Splint F PLUS",
    procedure: "long-arm-splint",
    braceEn: SPLINT_EN,
  },
  {
    id: "patella",
    type: "connect",
    name: "슬개골(무릎뼈)",
    short: "슬개골",
    nameEn: "patella (kneecap)",
    fact: "허벅지 근육의 힘줄 속에 있는 뼈. 무릎을 펴는 힘을 정강이로 전달하는 연결고리",
    injury: "무릎을 바닥이나 모서리에 세게 찧을 때",
    product: "splint-n-plus",
    brace: "NEAL Splint N PLUS",
    procedure: "long-leg-splint-en",
    braceEn: SPLINT_EN,
  },
  // ── 돌파형: 부딪히며 앞으로 나가는 뼈
  {
    id: "distal-radius",
    type: "breakthrough",
    name: "요골 원위부(손목 쪽 아래팔뼈)",
    short: "요골",
    nameEn: "radius (forearm bone near the wrist)",
    fact: "손목을 돌리게 해주는 뼈",
    injury: "넘어지며 손을 짚을 때 (빙판 주의)",
    product: "cast-plus",
    brace: "NEAL Cast PLUS",
    procedure: "short-arm-cast",
    braceEn: CAST_EN,
  },
  {
    id: "metatarsal",
    type: "breakthrough",
    name: "중족골(발등뼈)",
    short: "중족골",
    nameEn: "metatarsal (foot bone)",
    fact: "발가락과 발목을 잇는 5개의 뼈",
    injury: "반복 충격에 의한 피로골절(일명 행군골절)",
    product: "cast-premium",
    brace: "SMILE Cast PREMIUM",
    procedure: "short-leg-cast-smile",
    braceEn: CAST_EN,
  },
  {
    id: "fibula",
    type: "breakthrough",
    name: "비골(종아리뼈)",
    short: "비골",
    nameEn: "fibula (calf bone)",
    fact: "체중은 적게 받지만 발목 안정에 중요. 뼈 이식용으로 쓰이기도 함",
    injury: "발목 접질림과 함께 골절",
    product: "pre-mold",
    brace: "NEAL Pre-mold Splint (Short Leg)",
    procedure: "short-leg-splint",
    braceEn: "pre-molded leg splint with velcro straps",
  },
  // ── 섬세형: 작고 정교한 일을 하는 뼈
  {
    id: "scaphoid",
    type: "detail",
    name: "주상골(손배뼈)",
    short: "주상골",
    nameEn: "scaphoid (small wrist bone)",
    fact: "손목 엄지 쪽 작은 뼈. 손목뼈 골절 중 가장 흔하고 혈액 공급이 약해 회복이 느림",
    injury: "손을 짚고 넘어질 때. 엑스레이에 잘 안 보이기도 함",
    product: "cast-soft",
    brace: "NEAL Cast SOFT + Core Splint",
    procedure: "removable-cast",
    braceEn: CAST_EN,
  },
  {
    id: "distal-phalanx",
    type: "detail",
    name: "손가락 끝마디뼈",
    short: "손가락 끝마디뼈",
    nameEn: "fingertip bone (distal phalanx)",
    fact: "정교한 손작업 담당",
    injury: "손가락 끝에 공을 맞아 생기는 망치손가락",
    product: "splint-n-plus",
    brace: "NEAL Splint N PLUS",
    braceEn: "small finger splint",
  },
  {
    id: "metacarpal",
    type: "detail",
    name: "중수골(손허리뼈)",
    short: "중수골",
    nameEn: "metacarpal (hand bone)",
    fact: "손목과 손가락을 잇는 5개의 손바닥 뼈. 정교한 손동작의 뼈대",
    injury: "주먹으로 단단한 것을 칠 때 (일명 복서 골절)",
    product: "splint-sp",
    brace: "SMILE Splint SP",
    procedure: "short-arm-splint",
    braceEn: SPLINT_EN,
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

/** 가장 많이 나온 유형 (동점이면 랜덤) */
export function pickType(answers: BoneType[]): BoneType {
  const count = new Map<BoneType, number>();
  for (const a of answers) count.set(a, (count.get(a) ?? 0) + 1);
  const max = Math.max(...count.values());
  return pick([...count.entries()].filter(([, n]) => n === max).map(([t]) => t));
}

/** 그 유형의 뼈 풀에서 랜덤 1개 */
export function matchBone(type: BoneType): Bone {
  return pick(BONES.filter((b) => b.type === type));
}

export const getBone = (id: string) => BONES.find((b) => b.id === id);
