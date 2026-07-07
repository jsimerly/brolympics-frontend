import api from "../axios";

export const fetchTeam = (uuid) =>
  api.get(`/api/teams/${uuid}/`).then((r) => r.data);

/** data must include brolympics: <uuid>; blocked once registration closes. */
export const createTeam = (data) =>
  api.post("/api/teams/", data).then((r) => r.data);

/** img accepts a base64 data URL ('data:image/png;base64,...'). */
export const updateTeam = (uuid, patch) =>
  api.patch(`/api/teams/${uuid}/`, patch).then((r) => r.data);

export const deleteTeam = (uuid) => api.delete(`/api/teams/${uuid}/`);

/** Joins as the current user; creates my Player identity in the league if new. */
export const joinTeam = (uuid) =>
  api.post(`/api/teams/${uuid}/join/`).then((r) => r.data);

export const leaveTeam = (uuid) =>
  api.post(`/api/teams/${uuid}/leave/`).then((r) => r.data);

export const fetchTeamInvite = (uuid) =>
  api.get(`/api/teams/${uuid}/invite/`).then((r) => r.data);

/** Admins (or the player themself) pull a player off a team. */
export const removePlayerFromTeam = (teamUuid, playerUuid) =>
  api
    .post(`/api/teams/${teamUuid}/remove-player/`, { player: playerUuid })
    .then((r) => r.data);

/** Multipart image update (crop-tool File objects). */
export const updateTeamImage = (uuid, file) => {
  const form = new FormData();
  form.append("img", file);
  return api
    .patch(`/api/teams/${uuid}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
