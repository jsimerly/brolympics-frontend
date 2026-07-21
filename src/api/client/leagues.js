import api from "../axios";
import { fetchBrolympicsList, fetchBrolympicsStandings } from "./brolympics";

export const fetchLeagues = () =>
  api.get("/api/leagues/").then((r) => r.data);

/** League page data: the league + its brolympics categorized by state.
 * Completed bros get their podium attached (top-3 rows with team img +
 * roster names), newest first. */
export const fetchLeagueDetail = async (uuid) => {
  const [league, bros] = await Promise.all([
    fetchLeague(uuid),
    fetchBrolympicsList({ league: uuid }),
  ]);
  const completed = await Promise.all(
    bros
      .filter((b) => b.is_complete)
      .map(async (bro) => {
        const standings = await fetchBrolympicsStandings(bro.uuid).catch(
          () => []
        );
        return { ...bro, podium: standings.filter((row) => row.rank <= 3) };
      })
  );
  // newest first; ISO strings compare lexicographically
  const dateOf = (b) =>
    b.end_time || b.start_time || b.projected_end_date ||
    b.projected_start_date || "";
  completed.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  return {
    ...league,
    current_brolympics: bros.filter((b) => b.is_active),
    upcoming_brolympics: bros.filter((b) => !b.is_active && !b.is_complete),
    completed_brolympics: completed,
  };
};

export const deleteLeague = (uuid) => api.delete(`/api/leagues/${uuid}/`);

/** Multipart image update (crop-tool File objects). */
export const updateLeagueImage = (uuid, file) => {
  const form = new FormData();
  form.append("img", file);
  return api
    .patch(`/api/leagues/${uuid}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const fetchLeague = (uuid) =>
  api.get(`/api/leagues/${uuid}/`).then((r) => r.data);

export const createLeague = (data) =>
  api.post("/api/leagues/", data).then((r) => r.data);

export const updateLeague = (uuid, patch) =>
  api.patch(`/api/leagues/${uuid}/`, patch).then((r) => r.data);

export const joinLeague = (uuid) =>
  api.post(`/api/leagues/${uuid}/join/`).then((r) => r.data);

/** Invite landing card; works for any logged-in link holder. */
export const fetchLeagueInvite = (uuid) =>
  api.get(`/api/leagues/${uuid}/invite/`).then((r) => r.data);

export const addLeagueAdmin = (uuid, uid) =>
  api.post(`/api/leagues/${uuid}/add-admin/`, { uid }).then((r) => r.data);

/** Owner only. */
export const removeLeagueAdmin = (uuid, uid) =>
  api.post(`/api/leagues/${uuid}/remove-admin/`, { uid }).then((r) => r.data);

/** All-time: leaderboard, championships, and the teams register (every team
 * identity with its whole career -- renames fold in as `aka`).
 * `limit` caps the people-scaling lists server-side (Show More lazy loading);
 * the payload's `totals` block carries the full counts. */
export const fetchLeagueAllTime = (uuid, limit) =>
  api
    .get(`/api/leagues/${uuid}/all-time/${limit ? `?limit=${limit}` : ""}`)
    .then((r) => r.data);

/** All-time line for one team NAME (the name is the lineage): the all-games
 * record plus per-discipline finishes. */
export const fetchTeamCareer = (uuid, name) =>
  api
    .get(`/api/leagues/${uuid}/team-career/?name=${encodeURIComponent(name)}`)
    .then((r) => r.data);
