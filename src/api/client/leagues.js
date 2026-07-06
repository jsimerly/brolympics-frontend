import api from "../axios";
import { fetchBrolympicsList, fetchBrolympicsStandings } from "./brolympics";

export const fetchLeagues = () =>
  api.get("/api/leagues/").then((r) => r.data);

/** League page data: the league + its brolympics categorized by state.
 * Completed bros get their podium attached (winner/second/third names). */
export const fetchLeagueDetail = async (uuid) => {
  const [league, bros] = await Promise.all([
    fetchLeague(uuid),
    fetchBrolympicsList({ league: uuid }),
  ]);
  const completed = await Promise.all(
    bros
      .filter((b) => b.is_complete)
      .map(async (bro) => {
        const standings = await fetchBrolympicsStandings(bro.uuid);
        const at = (rank) =>
          standings
            .filter((row) => row.rank === rank)
            .map((row) => row.team.name)
            .join(", ") || null;
        return { ...bro, winner: at(1), second: at(2), third: at(3) };
      })
  );
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

/** All-time: leaderboard, championships, team lineages (by duo / by name). */
export const fetchLeagueAllTime = (uuid) =>
  api.get(`/api/leagues/${uuid}/all-time/`).then((r) => r.data);
