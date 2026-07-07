import api from "../axios";
import { fetchMyOpenContests } from "./contests";

/** filters: { league: <uuid> } */
export const fetchBrolympicsList = (filters = {}) =>
  api.get("/api/brolympics/", { params: filters }).then((r) => r.data);

/** Navbar slideout data: my bros split by state + my open contests. */
export const fetchUpcoming = async () => {
  const [bros, contests] = await Promise.all([
    fetchBrolympicsList(),
    fetchMyOpenContests(),
  ]);
  return {
    current_brolympics: bros.filter((b) => b.is_active),
    upcoming_brolympics: bros.filter((b) => !b.is_active && !b.is_complete),
    upcoming_competitions: contests,
  };
};

export const fetchBrolympics = (uuid) =>
  api.get(`/api/brolympics/${uuid}/`).then((r) => r.data);

/** data must include league: <league uuid>; admin only. */
export const createBrolympics = (data) =>
  api.post("/api/brolympics/", data).then((r) => r.data);

export const updateBrolympics = (uuid, patch) =>
  api.patch(`/api/brolympics/${uuid}/`, patch).then((r) => r.data);

export const deleteBrolympics = (uuid) =>
  api.delete(`/api/brolympics/${uuid}/`);

export const startBrolympics = (uuid) =>
  api.post(`/api/brolympics/${uuid}/start/`).then((r) => r.data);

/** Joins the brolympics AND its league (invite-link flow). */
export const joinBrolympics = (uuid) =>
  api.post(`/api/brolympics/${uuid}/join/`).then((r) => r.data);

export const fetchBrolympicsInvite = (uuid) =>
  api.get(`/api/brolympics/${uuid}/invite/`).then((r) => r.data);

export const fetchBrolympicsEvents = (uuid) =>
  api.get(`/api/brolympics/${uuid}/events/`).then((r) => r.data);

export const fetchBrolympicsTeams = (uuid) =>
  api.get(`/api/brolympics/${uuid}/teams/`).then((r) => r.data);

/** Brolympics page data: the bro + its teams + my admin flag + my team. */
export const fetchBrolympicsDetail = async (uuid) => {
  const bro = await fetchBrolympics(uuid);
  const [teams, league] = await Promise.all([
    fetchBrolympicsTeams(uuid),
    // league detail carries is_admin for the requesting user
    api.get(`/api/leagues/${bro.league}/`).then((r) => r.data),
  ]);
  return {
    ...bro,
    teams,
    is_admin: league.is_admin,
    user_team: teams.find((t) => t.players.some((p) => p.is_me)) ?? null,
  };
};

/** Overall standings (summed final event points), live at any moment. */
export const fetchBrolympicsStandings = (uuid) =>
  api.get(`/api/brolympics/${uuid}/standings/`).then((r) => r.data);
