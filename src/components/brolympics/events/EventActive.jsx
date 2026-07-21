import React, { useState } from "react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Bracket from "./Bracket";
import Img from "../../Util/Img";
import HeatManager from "./HeatManager.jsx";
import Comp_h2h from "./Competitions/Comp_h2h";
import { EventInfo } from "./EventInfo.jsx";
import { trimFloat } from "../../Util/format";
import { groupLog } from "./eventDisplay";

/** One outing line inside a team's group: total up front, players after. */
const OutingLine = ({ contest, gameNumber, showGameNumber }) => {
  const entries = contest.entries || [];
  const teamEntry = entries.find((e) => e.team && !e.player) || entries[0];
  const playerEntries = entries.filter((e) => e.player);
  const total =
    teamEntry?.score ??
    (playerEntries.length
      ? playerEntries.reduce((sum, e) => sum + (e.score ?? 0), 0)
      : null);

  return (
    <div className="flex items-start gap-2 py-1 ml-9 text-sm border-t first:border-t-0">
      {showGameNumber && (
        <span className="w-14 pt-0.5 text-xs shrink-0 text-light">
          Game {gameNumber}
        </span>
      )}
      <span className="w-10 font-bold shrink-0">
        {contest.is_complete && total != null ? trimFloat(total) : "–"}
      </span>
      <span className="flex flex-col flex-grow min-w-0 text-light">
        {playerEntries.length > 0 ? (
          playerEntries.map((e) => (
            <span className="flex justify-between gap-2" key={e.player}>
              <span className="truncate">{e.player_name}</span>
              <span className="shrink-0">{e.score ?? "—"}</span>
            </span>
          ))
        ) : (
          <span>{contest.is_complete ? "team score" : "not played yet"}</span>
        )}
      </span>
      {contest.is_active && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark shrink-0">
          live
        </span>
      )}
    </div>
  );
};

/** Outings grouped one block per team, in standings order. */
const TeamOutings = ({ contests, standings }) => {
  const order = new Map(
    (standings || []).map((row, i) => [String(row.team.uuid), i])
  );
  const groups = new Map();
  for (const contest of contests) {
    const teamEntry =
      contest.entries?.find((e) => e.team && !e.player) ||
      contest.entries?.[0];
    const key = String(teamEntry?.team ?? contest.uuid);
    if (!groups.has(key)) groups.set(key, { teamEntry, games: [] });
    groups.get(key).games.push(contest);
  }
  const ordered = [...groups.entries()].sort(
    ([a], [b]) => (order.get(a) ?? 99) - (order.get(b) ?? 99)
  );

  return (
    <div className="overflow-hidden card divide-y">
      {ordered.map(([key, { teamEntry, games }]) => (
        <div className="px-4 py-3" key={key}>
          <h3 className="flex items-center gap-2 pb-1.5 font-semibold">
            <Img
              src={teamEntry?.team_img}
              alt={teamEntry?.team_name}
              className="object-cover rounded-md w-7 h-7"
            />
            {teamEntry?.team_name}
          </h3>
          {games.map((contest, i) => (
            <OutingLine
              contest={contest}
              gameNumber={i + 1}
              showGameNumber={games.length > 1}
              key={contest.uuid}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const RESULT_STYLE = { w: "text-tertiary", l: "text-red", t: "text-light" };

/** h2h games grouped one block per team, standings order. Every game shows
 * under both teams -- that's the point: find your flag, read your season. */
const TeamGames = ({ contests, standings, teamFilter }) => {
  const rows = (standings || []).filter(
    (row) => !teamFilter || String(row.team.uuid) === teamFilter.uuid
  );
  const scoreOf = (entry) =>
    entry?.score ?? ({ w: "W", l: "L", t: "T" }[entry?.outcome] || "–");

  return (
    <div className="overflow-hidden card divide-y">
      {rows.map((row) => {
        const uuid = String(row.team.uuid);
        // log order is newest-first; a team's season reads oldest-first
        const games = contests
          .filter((c) => (c.entries || []).some((e) => String(e.team) === uuid))
          .slice()
          .reverse();
        const stats = row.stats || {};
        return (
          <div className="px-4 py-3" key={uuid}>
            <h3 className="flex items-center gap-2 pb-1.5 font-semibold">
              <Img
                src={row.team.img}
                alt={row.team.name}
                className="object-cover rounded-md w-7 h-7"
              />
              <span className="truncate">{row.team.name}</span>
              {stats.wins != null && (
                <span className="text-xs font-normal text-light">
                  {stats.wins}-{stats.losses}
                  {stats.ties ? `-${stats.ties}` : ""}
                </span>
              )}
            </h3>
            {games.map((contest) => {
              const mine = (contest.entries || []).find(
                (e) => String(e.team) === uuid
              );
              const opp = (contest.entries || []).find(
                (e) => e.team && String(e.team) !== uuid
              );
              return (
                <div
                  className="flex items-center gap-2 py-1 ml-9 text-sm border-t first:border-t-0"
                  key={contest.uuid}
                >
                  <span
                    className={`w-5 font-bold shrink-0 ${
                      RESULT_STYLE[mine?.outcome] || "text-light"
                    }`}
                  >
                    {contest.is_complete
                      ? (mine?.outcome || "—").toUpperCase()
                      : ""}
                  </span>
                  <span className="flex-grow min-w-0 truncate">
                    vs {opp?.team_name || "TBD"}
                    {contest.stage_structure === "knockout" && (
                      <AccountTreeOutlinedIcon
                        sx={{ fontSize: 13 }}
                        className="ml-1 text-light"
                      />
                    )}
                  </span>
                  <span className="shrink-0 text-light">
                    {contest.is_complete
                      ? `${scoreOf(mine)} : ${scoreOf(opp)}`
                      : !contest.is_active
                      ? "not played"
                      : ""}
                  </span>
                  {contest.is_active && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark shrink-0">
                      live
                    </span>
                  )}
                  {contest.needs_confirmation && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"
                      title={`unconfirmed — recorded by ${contest.recorded_by_name}`}
                    />
                  )}
                </div>
              );
            })}
            {games.length === 0 && (
              <p className="ml-9 text-sm text-light">No games yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

const EventActive = ({ eventInfo, is_admin }) => {
  // h2h: tap a standings row to see just that team's games
  const [teamFilter, setTeamFilter] = useState(null);
  // "teams" = one section per team (like bowling); "log" = flat game list
  const [gamesView, setGamesView] = useState("teams");

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 12) return "18px";
      if (name.length <= 16) return "16px";
      return "14px";
    }
  };

  const getDisplayInfo = (row) => {
    const stats = row.stats || {};
    if (eventInfo?.type === "h2h") {
      if (stats.wins == null) return "";
      return `${stats.wins}-${stats.losses}${
        stats.ties ? `-${stats.ties}` : ""
      }`;
    }
    return trimFloat(stats.total ?? stats.placement_points ?? "");
  };

  const displayPoints = (points) => {
    if (points == null) return "—";
    return Number.isInteger(points) ? points : points.toFixed(1);
  };

  if (!eventInfo) return <div>Loading...</div>;

  const isH2h = eventInfo.type === "h2h";
  const toggleTeamFilter = (team) =>
    setTeamFilter((current) =>
      current?.uuid === String(team.uuid)
        ? null
        : { uuid: String(team.uuid), name: team.name }
    );
  const shownContests = teamFilter
    ? (eventInfo.contests || []).filter((c) =>
        (c.entries || []).some((e) => String(e.team) === teamFilter.uuid)
      )
    : eventInfo.contests;

  return (
    <div className="max-w-4xl">
      {eventInfo.blind_active && (
        <div className="flex items-center gap-2 p-3 mx-4 mb-3 text-sm border rounded-lg border-secondary/40 bg-secondary/5">
          <VisibilityOffOutlinedIcon
            sx={{ fontSize: 18 }}
            className="shrink-0 text-secondary"
          />
          Blind event — scores reveal on their own once every team has posted.
        </div>
      )}
      <div className="px-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="flex items-center header-3">
            Standings
            {eventInfo.is_complete && (
              <span className="ml-2 pt-2 text-secondary text-[10px] flex items-center gap-1">
                Final <TaskAltIcon sx={{ fontSize: 14 }} />
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-hidden card">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
                <th className="w-[60px] p-2">
                  <NumbersOutlinedIcon sx={{ fontSize: 20 }} />
                </th>
                <th className="pl-3 text-start">Team</th>
                <th className="w-[80px]">
                  <DiamondOutlinedIcon sx={{ fontSize: 20 }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {eventInfo.standings &&
                eventInfo.standings.map((row, i) => (
                  <tr
                    key={i + "_row"}
                    className={`${
                      teamFilter?.uuid === String(row.team.uuid)
                        ? "!bg-primary/10"
                        : i % 2 === 0
                        ? "bg-gray-50"
                        : ""
                    } ${isH2h ? "cursor-pointer" : ""}`}
                    onClick={
                      isH2h ? () => toggleTeamFilter(row.team) : undefined
                    }
                  >
                    <td className="p-3 font-semibold text-center border-t">
                      {row.rank}
                    </td>
                    <td className="pl-3 border-t text-start">
                      <div className="flex items-center gap-2">
                        <Img
                          src={row.team.img}
                          className="w-[30px] h-[30px] rounded-md"
                          alt={row.team.name}
                        />
                        <div className="flex flex-col justify-center">
                          <span
                            className={`text-[${getFontSize(
                              row.team.name
                            )}] leading-5`}
                          >
                            {row.team.name}
                          </span>
                          <span className="text-[10px]">
                            {getDisplayInfo(row)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 font-semibold text-center border-t">
                      {displayPoints(row.points)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isH2h && (eventInfo.contests || []).length > 0 && (
          <p className="pt-1 text-[10px] text-light">
            Tap a team to see just their games.
          </p>
        )}
      </div>
      <div className="py-3">
        {(eventInfo.brackets || []).map((bracket) => (
          <Bracket key={bracket.stage} {...bracket} />
        ))}
      </div>
      {eventInfo.type === "ffa" ? (
        <HeatManager event={eventInfo} is_admin={is_admin} />
      ) : (
        eventInfo.contests &&
        eventInfo.contests.length > 0 && (
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="header-3">Games</h2>
              <div className="flex items-center gap-2">
                {teamFilter && (
                  <button
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary"
                    onClick={() => setTeamFilter(null)}
                  >
                    {teamFilter.name} <CloseIcon sx={{ fontSize: 14 }} />
                  </button>
                )}
                {eventInfo.type === "h2h" && (
                  <div className="flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0">
                    {[
                      ["teams", "By team"],
                      ["log", "Game log"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        className={`px-3 py-1.5 ${
                          gamesView === key
                            ? "bg-primary text-white"
                            : "bg-white text-light"
                        }`}
                        onClick={() => setGamesView(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {eventInfo.type === "h2h" ? (
              gamesView === "teams" ? (
                <TeamGames
                  contests={eventInfo.contests}
                  standings={eventInfo.standings}
                  teamFilter={teamFilter}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {groupLog(shownContests).map((group, i) => (
                    <div key={i}>
                      <h3 className="pb-1 text-xs font-semibold tracking-wide uppercase text-light">
                        {group.label}
                      </h3>
                      <div className="overflow-hidden card divide-y">
                        {group.games.map((contest) => (
                          <Comp_h2h {...contest} key={contest.uuid} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {shownContests.length === 0 && (
                    <p className="p-4 text-sm bg-white rounded-lg text-light">
                      No games yet for {teamFilter?.name}.
                    </p>
                  )}
                </div>
              )
            ) : (
              <TeamOutings
                contests={eventInfo.contests}
                standings={eventInfo.standings}
              />
            )}
          </div>
        )
      )}

      <EventInfo event={eventInfo} />
    </div>
  );
};

export default EventActive;
