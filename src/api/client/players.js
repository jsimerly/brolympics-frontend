import api from "../axios";

export const fetchPlayers = (leagueUuid) =>
  api
    .get("/api/players/", { params: { league: leagueUuid } })
    .then((r) => r.data);

export const fetchPlayer = (uuid) =>
  api.get(`/api/players/${uuid}/`).then((r) => r.data);

/**
 * All-time career: { player, total_points, event_wins, podiums,
 * disciplines: [{event_type, format, events_played, years, record,
 * event_wins, podiums, points, best_score, avg_score, heats}] }
 */
export const fetchPlayerCareer = (uuid) =>
  api.get(`/api/players/${uuid}/career/`).then((r) => r.data);
