import api from "../axios";
import {
  fetchBrolympicsStandings,
  fetchBrolympicsPodiums,
  fetchBrolympicsEvents,
} from "./brolympics";
import { fetchContests } from "./contests";
import { fetchEventRankings } from "./events";

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

/** Team page data: the team + overall ranking + a per-event breakdown
 * (rank/points/stats where known, plus this team's contests). */
export const fetchTeamInfo = async (teamUuid) => {
  const team = await fetchTeam(teamUuid);
  const broUuid = team.brolympics;
  const [standings, podiums, events, contests] = await Promise.all([
    fetchBrolympicsStandings(broUuid).catch(() => []),
    fetchBrolympicsPodiums(broUuid).catch(() => []),
    fetchBrolympicsEvents(broUuid),
    fetchContests({ team: teamUuid }),
  ]);
  const rankingLists = await Promise.all(
    events.map((e) => fetchEventRankings(e.uuid).catch(() => []))
  );

  const overall = standings.find((row) => row.team.uuid === teamUuid);
  const finished = podiums.flatMap((p) => [p.first, p.second, p.third]);
  const overall_ranking = {
    rank: overall?.rank,
    total_points: overall?.points,
    event_wins: podiums.filter((p) => p.first.includes(team.name)).length,
    event_podiums: finished.filter((names) => names.includes(team.name))
      .length,
  };

  const myEntry = (c) => c.entries.find((e) => e.team === teamUuid);
  const eventsOut = events.map((event, i) => {
    const ranking = rankingLists[i].find((r) => r.team.uuid === teamUuid);
    const mine = contests.filter((c) => c.event === event.uuid);
    const done = mine.filter((c) => c.is_complete);
    const stats = ranking?.stats && Object.keys(ranking.stats).length
      ? ranking.stats
      : {
          wins: done.filter((c) => myEntry(c)?.outcome === "w").length,
          losses: done.filter((c) => myEntry(c)?.outcome === "l").length,
          ties: done.filter((c) => myEntry(c)?.outcome === "t").length,
          total: done.reduce((sum, c) => sum + (myEntry(c)?.score ?? 0), 0),
        };
    return {
      uuid: event.uuid,
      name: event.name,
      type: event.format,
      is_active: event.is_active,
      is_final: !!ranking?.is_final,
      rank: ranking?.rank,
      points: ranking?.points,
      stats,
      contests: mine,
    };
  });

  return { team: { ...team, overall_ranking }, events: eventsOut };
};

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
