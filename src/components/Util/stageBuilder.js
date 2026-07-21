/** The wizard's structure math, shared by CreateEvent and ManageEvent -- the
 * two used to carry separate copies that could silently diverge.
 *
 * buildStages(form) turns the structure choices into the API stage list;
 * formFromStages(stages) is its inverse for the edit screen. The round-trip
 * (formFromStages(buildStages(f)) preserving f) is pinned by tests.
 */

/**
 * form: {
 *   format:      'h2h' | 'ind' | 'team' | 'ffa'
 *   groupPlay:   'semi' | 'full' | 'swiss' | 'none'   (h2h only)
 *   nMatches:    group games / swiss rounds (string or number; default 4)
 *   hasPlayoffs: boolean (h2h; a bracket is forced when there's no group play)
 *   take:        bracket size ('' / number; '' = whole field)
 *   runoffs:     'off' | 'third' | 'every' | 'custom'
 *   placeThrough: deepest place played out under custom (default take - 2)
 *   heatSize:    ffa racers per heat ('' allowed at creation; the event
 *                can't START without one -- it surfaces as a setup issue)
 *   outingGames: ind/team games per team (default 1)
 * }
 */
export const buildStages = ({
  format,
  groupPlay,
  nMatches,
  hasPlayoffs,
  take,
  runoffs,
  placeThrough,
  heatSize,
  outingGames,
}) => {
  if (format === "ffa") {
    const size = Number(heatSize);
    return [{ structure: "heats", config: size >= 2 ? { heat_size: size } : {} }];
  }
  if (format !== "h2h") {
    const games = Number(outingGames);
    return [
      {
        structure: "open_play",
        config: games >= 1 ? { games_per_team: games } : {},
      },
    ];
  }

  const stages = [];
  const n = Number(nMatches) || 4;
  if (groupPlay === "semi") {
    stages.push({ structure: "round_robin", config: { games_per_team: n } });
  } else if (groupPlay === "full") {
    stages.push({ structure: "round_robin", config: { full: true } });
  } else if (groupPlay === "swiss") {
    stages.push({ structure: "swiss", config: { rounds: n } });
  }
  if (hasPlayoffs || stages.length === 0) {
    const config = { byes: "seeded" };
    const takeN = Number(take);
    if (takeN >= 2) config.take = takeN;
    if (runoffs === "every" || runoffs === "custom") {
      // classification pools include the 3rd place game
      config.classification = true;
      if (runoffs === "custom" && takeN >= 6) {
        const through = Number(placeThrough) || takeN - 2;
        const unplayed = [];
        for (let place = 3; place < takeN; place += 2) {
          if (place > through) unplayed.push(place);
        }
        if (unplayed.length) config.unplayed_places = unplayed;
      }
    } else if (runoffs === "third") {
      config.third_place = true;
    }
    stages.push({ structure: "knockout", config });
  }
  return stages;
};

/** Read a stored stage list back into the structure-form shape. */
export const formFromStages = (stages = []) => {
  const rr = stages.find((s) => s.structure === "round_robin");
  const swiss = stages.find((s) => s.structure === "swiss");
  const ko = stages.find((s) => s.structure === "knockout");
  const heats = stages.find((s) => s.structure === "heats");
  const openPlay = stages.find((s) => s.structure === "open_play");
  return {
    groupPlay: swiss ? "swiss" : rr ? (rr.config?.full ? "full" : "semi") : "none",
    nMatches: rr?.config?.games_per_team ?? swiss?.config?.rounds ?? "",
    hasPlayoffs: !!ko,
    take: ko?.config?.take ?? "",
    runoffs: ko?.config?.classification
      ? ko?.config?.unplayed_places?.length
        ? "custom"
        : "every"
      : ko?.config?.third_place
      ? "third"
      : "off",
    placeThrough:
      ko?.config?.take && ko?.config?.unplayed_places?.length
        ? ko.config.take - 2 * ko.config.unplayed_places.length
        : "",
    heatSize: heats?.config?.heat_size ?? "",
    outingGames: openPlay?.config?.games_per_team ?? 1,
  };
};
