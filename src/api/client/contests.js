import api from "../axios";

/**
 * List contests. filters: { event, team, player, mine: true, open: true }
 * -- `mine` = contests involving any of my player identities/teams.
 */
export const fetchContests = (filters = {}) =>
  api
    .get("/api/contests/", {
      params: Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== false)
      ),
    })
    .then((r) => r.data);

export const fetchContest = (uuid) =>
  api.get(`/api/contests/${uuid}/`).then((r) => r.data);

/**
 * Record a result. One endpoint, payload depends on contest.kind:
 *   match:  { scores: { [teamUuid]: score, [teamUuid]: score } }
 *   outing: { player_scores: { [playerUuid]: score }, team_score? }
 *   heat:   { placements: { [playerUuid]: 1.. } }
 * Participants and admins may record; ties rejected inside brackets.
 */
export const recordContest = (uuid, payload) =>
  api.post(`/api/contests/${uuid}/record/`, payload).then((r) => r.data);

/**
 * Admin-only undo for a mis-entered result. 400s once anything downstream
 * consumed the result (next bracket round recorded, later swiss round paired,
 * stage closed, event finalized).
 */
export const unrecordContest = (uuid) =>
  api.post(`/api/contests/${uuid}/unrecord/`).then((r) => r.data);

/** Participant check-in: "we're playing this now". */
export const startContest = (uuid) =>
  api.post(`/api/contests/${uuid}/start/`).then((r) => r.data);

/** Back out of a started contest without a result. */
export const abandonContest = (uuid) =>
  api.post(`/api/contests/${uuid}/abandon/`).then((r) => r.data);

/** Convenience: everything I'm currently supposed to be playing. */
export const fetchMyOpenContests = () =>
  fetchContests({ mine: true, open: true });

/** Self-reported results in my games still waiting on the other side.
 * Rows carry can_confirm -- true when *I* am eligible to attest. */
export const fetchMyPendingConfirmations = () =>
  fetchContests({ mine: true, pending_confirmation: true });

/** Attest a result someone from the other team recorded. */
export const confirmContest = (uuid) =>
  api.post(`/api/contests/${uuid}/confirm/`).then((r) => r.data);
