/** Number/score display helpers shared by every game surface. Extracted from
 * inline copies (EventActive, Event_outing, the score inputs) so they can't
 * silently diverge again. */

/** 25.05 + 25.208 should read 50.258, not 50.257999999999996. */
export const trimFloat = (value) =>
  typeof value === "number" ? parseFloat(value.toPrecision(10)) : value;

/** Free-typing score input: digits with at most one dot ("12", "1.", "12.5",
 * ""). The old integer-only version made K1 lap times untypeable. */
export const SCORE_INPUT_RE = /^\d*\.?\d*$/;
export const isScoreInput = (value) => value === "" || SCORE_INPUT_RE.test(value);

/** 1st, 2nd, 3rd, 4th ... 11th, 12th, 13th, 21st. */
export const ordinal = (n) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};
