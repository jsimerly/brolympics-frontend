/** The classics: curated starter events for new (or thin-history) leagues.
 * Each carries its format and scoring direction; structures come from
 * defaultStagesFor at create time. */
export const PRESET_EVENTS = [
  { name: "Cornhole", format: "h2h" },
  { name: "Beer Pong", format: "h2h" },
  { name: "Flip Cup", format: "h2h" },
  { name: "Beer Die", format: "h2h" },
  { name: "Spikeball", format: "h2h" },
  { name: "Mini-Golf", format: "ind", is_high_score_wins: false },
  { name: "Golf", format: "ind", is_high_score_wins: false },
  { name: "Bowling", format: "ind" },
  { name: "Home Run Derby", format: "ind" },
  { name: "Trivia", format: "team" },
  { name: "Mario Kart", format: "ffa" },
];

/** Lineage-first with classics topping up thin histories: 5+ prior events
 * means the league knows what it likes; fewer, and we suggest classics they
 * haven't already played. */
export const suggestionsFor = (lineage) => {
  // staples first: most-played at the top, one-offs at the bottom
  lineage = [...lineage].sort(
    (a, b) =>
      (b.times_played || 0) - (a.times_played || 0) ||
      a.name.localeCompare(b.name)
  );
  const played = new Set(lineage.map((row) => row.name.trim().toLowerCase()));
  const presets = PRESET_EVENTS.filter(
    (preset) => !played.has(preset.name.toLowerCase())
  ).map((preset) => ({ ...preset, preset: true }));
  if (lineage.length >= 5) return lineage;
  return [...lineage, ...presets];
};
