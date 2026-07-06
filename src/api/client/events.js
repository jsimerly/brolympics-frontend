import api from "../axios";

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

export const fetchEventTypes = (leagueUuid) =>
  api
    .get("/api/event-types/", { params: { league: leagueUuid } })
    .then((r) => r.data);

/** A discipline through the years: podiums per year + all-time bests. */
export const fetchEventTypeHistory = (uuid) =>
  api.get(`/api/event-types/${uuid}/history/`).then((r) => r.data);
