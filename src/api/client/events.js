import api from "../axios";
import { fetchContests } from "./contests";

export const fetchEvent = (uuid) =>
  api.get(`/api/events/${uuid}/`).then((r) => r.data);

/**
 * Create an event with its stage list. Response includes `warnings`: non-blocking
 * setup heads-ups (odd-field swiss byes, bracket byes) to show the organizer.
 * Impossible configs come back as a 400 with a plain-English message.
 *
 * payload: {
 *   brolympics: <uuid>, event_type_name, format: 'h2h'|'ind'|'team'|'ffa',
 *   stages: [{structure: 'round_robin'|'swiss'|'knockout'|'heats'|'open_play',
 *             config: {...}}],
 *   config?, is_high_score_wins?, location?, rules?,
 * }
 */
export const createEvent = (payload) =>
  api.post("/api/events/", payload).then((r) => r.data);

export const updateEvent = (uuid, patch) =>
  api.patch(`/api/events/${uuid}/`, patch).then((r) => r.data);

export const deleteEvent = (uuid) => api.delete(`/api/events/${uuid}/`);

export const startEvent = (uuid) =>
  api.post(`/api/events/${uuid}/start/`).then((r) => r.data);

export const cancelEvent = (uuid) =>
  api.post(`/api/events/${uuid}/cancel/`).then((r) => r.data);

export const reinstateEvent = (uuid) =>
  api.post(`/api/events/${uuid}/reinstate/`).then((r) => r.data);

/** Live standings -- whole field, any time after start. */
export const fetchEventStandings = (uuid) =>
  api.get(`/api/events/${uuid}/standings/`).then((r) => r.data);

/** Final stored rankings (rank, points, stats), once the event completes. */
export const fetchEventRankings = (uuid) =>
  api.get(`/api/events/${uuid}/rankings/`).then((r) => r.data);

/**
 * Knockout topology: [{stage, is_complete, nodes: [{round, slot, winner_to,
 * loser_to, contest}]}]. winner_to/loser_to are [round, slot] coordinates.
 */
export const fetchEventBracket = (uuid) =>
  api.get(`/api/events/${uuid}/bracket/`).then((r) => r.data);

/** FFA events: create a heat from player uuids; returns the heat contest. */
export const addHeat = (uuid, playerUuids) =>
  api
    .post(`/api/events/${uuid}/add-heat/`, { players: playerUuids })
    .then((r) => r.data);

/** Admin: finish an open-ended heats/open-play stage (advance or finalize). */
export const closeEventStage = (uuid) =>
  api.post(`/api/events/${uuid}/close-stage/`).then((r) => r.data);

/** Default stage lists per format for quick event creation; the manage page
 * can reshape any event later. */
export const defaultStagesFor = (format) =>
  ({
    h2h: [
      { structure: "round_robin", config: { games_per_team: 4 } },
      {
        structure: "knockout",
        config: { take: 4, third_place: true, byes: "seeded" },
      },
    ],
    ind: [{ structure: "open_play", config: {} }],
    team: [{ structure: "open_play", config: {} }],
    ffa: [{ structure: "heats", config: {} }],
  }[format] || [{ structure: "open_play", config: {} }]);

/** Event page data: the event + a normalized standings table + its contests +
 * bracket topology (when a knockout stage exists). `type` mirrors format. */
export const fetchEventInfo = async (uuid) => {
  const [event, contests] = await Promise.all([
    fetchEvent(uuid),
    fetchContests({ event: uuid }),
  ]);
  const hasKnockout = (event.stages || []).some(
    (s) => s.structure === "knockout"
  );
  const [standings, brackets] = await Promise.all([
    event.is_complete
      ? fetchEventRankings(uuid)
      : event.is_active
      ? fetchEventStandings(uuid).catch(() => [])
      : Promise.resolve([]),
    hasKnockout ? fetchEventBracket(uuid).catch(() => []) : Promise.resolve([]),
  ]);
  return {
    ...event,
    type: event.format,
    standings: standings.map((row, i) => ({
      rank: row.rank ?? i + 1,
      points: row.points ?? null,
      team: row.team,
      stats: row.stats || {},
    })),
    contests,
    brackets,
  };
};

export const fetchEventTypes = (leagueUuid) =>
  api
    .get("/api/event-types/", { params: { league: leagueUuid } })
    .then((r) => r.data);

/** A discipline through the years: podiums per year + all-time bests. */
export const fetchEventTypeHistory = (uuid, leaders) =>
  api
    .get(
      `/api/event-types/${uuid}/history/${
        leaders != null ? `?leaders=${leaders}` : ""
      }`
    )
    .then((r) => r.data);
