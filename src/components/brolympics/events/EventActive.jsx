import React from "react";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Bracket from "./Bracket";
import Img from "../../Util/Img";
import HeatManager from "./HeatManager.jsx";
import Comp_h2h from "./Competitions/Comp_h2h";
import { EventInfo } from "./EventInfo.jsx";

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
        {contest.is_complete && total != null ? total : "–"}
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

const EventActive = ({ eventInfo, is_admin }) => {

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
    return stats.total ?? stats.placement_points ?? "";
  };

  const displayPoints = (points) => {
    if (points == null) return "—";
    return Number.isInteger(points) ? points : points.toFixed(1);
  };

  if (!eventInfo) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
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
                    className={i % 2 === 0 ? "bg-gray-50" : ""}
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
            <h2 className="mb-4 header-3">Competitions</h2>
            {eventInfo.type === "h2h" ? (
              <div className="overflow-hidden card divide-y">
                {eventInfo.contests.map((contest) => (
                  <Comp_h2h {...contest} key={contest.uuid} />
                ))}
              </div>
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
