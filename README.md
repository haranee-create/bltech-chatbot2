# 뼈BTI 🦴 — 나는 어떤 뼈일까?

비엘테크 직원용 재미 + 제품교육 마이크로서비스.
**사진 한 장과 질문 3개**로 나를 닮은 뼈를 알려주고, 그 뼈 옷을 입은 내 모습을
**그림판에서 마우스로 대충 그린 그림**으로 그려 줍니다.

흐름: 사진 업로드 → 질문 3개 → 뼈 결정 → 그림판 낙서 이미지 + 결과 카드 → 공유

- 뼈 결정: 질문 3개 답 중 가장 많이 나온 유형(동점이면 랜덤) → 그 유형의 뼈 풀에서 랜덤 1개.
- 모든 뼈는 그 뼈를 지켜주는 **비엘테크 제품**(NEAL/SMILE 캐스트·부목, 하이드로겔 피부보호대)과 짝지어져 있고,
  결과 글은 홈페이지 제품 소개에 나온 특징만으로 제품을 소개합니다.
  **사진은 그림에만 쓰고, 얼굴로 성격을 판단하지 않습니다.**
- 그림: `gpt-image-2.5-sunburst` (Image API `images.edit`, 업로드 사진 기반)
- 작문: `gpt-5.6-terra` (Responses API, JSON 스키마 구조화 출력, 데이터 시트의 사실만 사용)
- 공유: 그림 + 텍스트를 합성한 카드 2종
  - 세로 1200×1500 — 이미지 저장 / 카톡·다른 앱 공유용
  - 가로 1200×630 — 페이스북 링크 미리보기(og:image)용
  - 페이스북은 게시글 문구를 미리 채울 수 없어서, 공유 버튼을 누르면 문구가 클립보드에 복사됩니다.

## 로컬 실행

```bash
npm install
```

`.env` 파일의 `OPENAI_API_KEY=` 뒤에 키를 넣고:

```bash
npm run dev
```

http://localhost:3000 접속.

## Vercel 배포

1. Vercel에서 이 GitHub 저장소(`haranee-create/bltech-chatbot2`)를 Import
2. **Settings → Environment Variables** 에 `OPENAI_API_KEY` 추가
3. **Storage → Create → Blob** 으로 Blob 저장소를 만들고 프로젝트에 연결
   (`BLOB_READ_WRITE_TOKEN` 이 자동으로 들어갑니다 — 페이스북 공유 링크용)
4. (선택) 커스텀 도메인을 쓰면 `NEXT_PUBLIC_SITE_URL` 에 주소를 넣기
5. Redeploy

> Blob 없이도 서비스는 동작합니다. 이 경우 페이스북 버튼은 공유 이미지를 내려받게 하고
> 사이트 주소만 공유합니다. (페이스북은 링크의 미리보기 이미지만 가져가기 때문에,
> 합성 이미지가 보이게 공유하려면 이미지를 공개 URL로 올려 둘 곳이 필요합니다.)

## 구조

| 파일 | 역할 |
| --- | --- |
| `lib/bones.ts` | **뼈 데이터 시트 · 비엘테크 제품(PRODUCTS) · 질문 3개 · 매칭 규칙** — 제품 정보는 www.bl-tech.co.kr 기준 |
| `lib/openai.ts` | 작문(gpt-5.6-terra) / 그림(gpt-image-2.5-sunburst) 호출과 프롬프트 |
| `lib/ratelimit.ts` | 1인(IP)당 하루 생성 횟수 제한 |
| `app/api/generate` | 사진 + 답변 → 뼈 결정, 그림 + 결과 글 생성 API |
| `app/api/share` | 합성 카드를 Blob에 올리고 공유 링크 발급 |
| `app/s/[id]` | 공유 페이지 (페이스북 미리보기용 og:image 포함) |
| `lib/card.ts` | 공유 카드 합성(canvas), 업로드 전 사진 축소 |

## 비용 · 운영 주의

- 한 번 생성할 때마다 내 API 키로 그림 1장 + 글 1편 비용이 나갑니다.
  OpenAI 대시보드에서 사용 한도(Usage limit)를 꼭 걸어 두세요. 그림 품질은 `IMAGE_QUALITY`(기본 `medium`)로 조절합니다.
- `DAILY_LIMIT`(기본 5회)는 서버 메모리 기준이라 Vercel에서 인스턴스가 여러 개 뜨면 완벽하지 않습니다.
  엄격하게 막아야 하면 Vercel KV / Upstash Redis 같은 공용 저장소로 바꾸세요.
- 화면 하단 고지: "재미용 테스트이며 의료 진단이 아닙니다. 사진은 그림 생성에만 쓰이고 저장되지 않습니다."
