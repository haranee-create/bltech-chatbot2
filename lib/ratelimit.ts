/**
 * 1인당 하루 생성 횟수 제한 (IP 기준, 서버 메모리).
 * Vercel 서버리스는 인스턴스가 여러 개 뜰 수 있어 완벽하지 않은 "최선 노력" 제한입니다.
 * 엄격하게 막으려면 Vercel KV/Upstash 같은 공용 저장소로 바꾸세요.
 */
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT || 5);
const hits = new Map<string, { day: string; n: number }>();

const today = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10); // KST 기준 날짜

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

/** 남은 횟수가 있으면 1 차감하고 true */
export function take(ip: string): boolean {
  if (DAILY_LIMIT <= 0) return true;
  const day = today();
  const cur = hits.get(ip);
  if (!cur || cur.day !== day) {
    if (hits.size > 10_000) hits.clear();
    hits.set(ip, { day, n: 1 });
    return true;
  }
  if (cur.n >= DAILY_LIMIT) return false;
  cur.n += 1;
  return true;
}

/** 생성이 실패하면 차감한 1회를 돌려준다 */
export function refund(ip: string) {
  const cur = hits.get(ip);
  if (cur && cur.n > 0) cur.n -= 1;
}

export { DAILY_LIMIT };
