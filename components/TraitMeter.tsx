import { QUESTIONS, TRAITS, TRAIT_DESC, TRAIT_LABEL, type Scores, type Trait } from "@/lib/roles";

/** 4가지 업무 성향 점수. 유형을 만든 성향은 진하게, 나머지는 옅게 */
export default function TraitMeter({ scores, highlight }: { scores: Scores; highlight: readonly Trait[] }) {
  const total = QUESTIONS.length;
  return (
    <div
      className="meter"
      role="img"
      aria-label={`업무 성향 점수: ${TRAITS.map((t) => `${TRAIT_LABEL[t]} ${scores[t]}점`).join(", ")} (총 ${total}문항)`}
    >
      {TRAITS.map((t) => (
        <div key={t} className={`meter-row ${highlight.includes(t) ? "on" : ""}`} title={`${TRAIT_LABEL[t]}: ${TRAIT_DESC[t]}`}>
          <span className="meter-label">
            <b>{TRAIT_LABEL[t]}</b>
            <small>{TRAIT_DESC[t]}</small>
          </span>
          <span className="meter-track" aria-hidden>
            <span className="meter-fill" style={{ width: `${(scores[t] / total) * 100}%` }} />
          </span>
          <span className="meter-value">
            {scores[t]}
            <small>/{total}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
