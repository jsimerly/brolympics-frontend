import api from "../axios";

export const fetchBrolympicsList = () =>
  api.get("/api/brolympics/").then((r) => r.data);

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

/** Overall standings (summed final event points), live at any moment. */
export const fetchBrolympicsStandings = (uuid) =>
  api.get(`/api/brolympics/${uuid}/standings/`).then((r) => r.data);
