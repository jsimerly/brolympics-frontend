/** Pure display logic for event pages: game-log grouping, stage/score-format
 * sentences, rules detection, and bracket-tree grouping. Extracted from
 * EventActive/EventInfo/Bracket so the truth-telling copy is testable. */

/** Chunk the (stage-desc, round-desc ordered) log into labeled sections:
 * playoff rounds first (finals labeled as such), then group-play rounds. */
export const groupLog = (contests) => {
  const groups = [];
  let key = null;
  for (const contest of contests) {
    const k = `${contest.stage_structure}|${contest.round}`;
    if (k !== key) {
      key = k;
      groups.push({
        structure: contest.stage_structure,
        round: contest.round,
        games: [],
      });
    }
    groups[groups.length - 1].games.push(contest);
  }
  const finalsRound = Math.max(
    0,
    ...contests
      .filter((c) => c.stage_structure === "knockout")
      .map((c) => c.round ?? 0)
  );
  return groups.map((g) => ({
    ...g,
    label:
      g.structure === "knockout"
        ? g.round === finalsRound
          ? "Playoffs · Finals"
          : `Playoffs · Round ${g.round}`
        : g.round != null
        ? `Round ${g.round}`
        : "Games",
  }));
};

/** Plain-English structure line for one stage (Event Info card). */
export const stageSentence = (stage) => {
  const cfg = stage.config || {};
  if (stage.structure === "round_robin") {
    return cfg.full
      ? "Full round robin — everyone plays everyone"
      : `Round robin — ${cfg.games_per_team ?? "?"} games per team`;
  }
  if (stage.structure === "swiss") {
    return `Swiss — ${cfg.rounds ?? "?"} rounds paired by record`;
  }
  if (stage.structure === "knockout") {
    const bits = [cfg.take ? `top ${cfg.take}` : "everyone"];
    if (cfg.classification) bits.push("every place played out");
    else if (cfg.third_place) bits.push("3rd place game");
    return `Playoffs — ${bits.join(", ")}`;
  }
  if (stage.structure === "heats") {
    return cfg.heat_size
      ? `Heats of ${cfg.heat_size}, preset at start`
      : "Heats made at the party";
  }
  if (stage.structure === "open_play") {
    const games = cfg.games_per_team ?? 1;
    return games > 1 ? `${games} games per team` : "One game per team";
  }
  return stage.structure.replace("_", " ");
};

/** Keyed by String(decimal_places) -- "0" must hit "Whole numbers", never
 * fall through a truthiness check (the falsy-zero display bug). */
export const SCORE_FORMAT_LABEL = {
  B: "Win/Loss only",
  0: "Whole numbers (1)",
  1: "Tenths (1.0)",
  2: "Hundredths (1.00)",
  3: "Thousandths (1.000)",
  16: "Any decimal",
};

/** Quill leaves "<p><br></p>" behind in emptied editors. */
export const hasRules = (rules) =>
  rules && rules.replace(/<[^>]*>/g, "").trim().length > 0;

/** "Championship" / "Third Place" / "Placement Game" (legacy null) -- the
 * null guard is the Nullth-place fix. */
export const placeLabel = (p) =>
  p == null
    ? "Placement Game" // legacy nodes without decides_place
    : { 1: "Championship", 3: "Third Place", 5: "Fifth Place", 7: "Seventh Place" }[
        p
      ] || `${p}th Place`;

/** Group bracket nodes by the terminal game their winner_to chain reaches:
 * the championship tree first, then classification pools by decided place. */
export const groupBracketNodes = (nodes) => {
  const byKey = Object.fromEntries(
    nodes.map((n) => [`${n.round}_${n.slot}`, n])
  );
  const terminalOf = (node) => {
    let cur = node;
    while (cur.winner_to) {
      const next = byKey[`${cur.winner_to[0]}_${cur.winner_to[1]}`];
      if (!next) break;
      cur = next;
    }
    return cur;
  };
  const groups = new Map();
  for (const node of nodes) {
    const terminal = terminalOf(node);
    const key = `${terminal.round}_${terminal.slot}`;
    if (!groups.has(key)) groups.set(key, { terminal, members: [] });
    groups.get(key).members.push(node);
  }
  return [...groups.values()].sort(
    (a, b) => (a.terminal.decides_place || 99) - (b.terminal.decides_place || 99)
  );
};
