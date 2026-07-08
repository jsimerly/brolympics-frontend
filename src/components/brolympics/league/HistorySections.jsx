import React, { useEffect, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import {
  fetchPlayerCareer,
  fetchEventTypeHistory,
} from "../../../api/client";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const PlayerCareer = ({ playerUuid }) => {
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchPlayerCareer(playerUuid)
      .then(setCareer)
      .catch((error) => console.error("Error fetching career:", error));
  }, [playerUuid]);

  if (!career) return <div className="p-2 text-sm text-light">Loading...</div>;

  return (
    <div className="p-2 space-y-2">
      {career.disciplines.map((d, i) => (
        <div className="p-2 border rounded-md" key={i + "_discipline"}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{d.event_type}</h4>
            <span className="text-sm text-light">{d.years.join(", ")}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            <span>Points: {d.points}</span>
            {d.format === "h2h" ? (
              <span>
                Record: {d.record.wins}-{d.record.losses}
                {d.record.ties ? `-${d.record.ties}` : ""}
              </span>
            ) : d.heats.played > 0 ? (
              <span>
                Heats: {d.heats.wins} wins / {d.heats.played}
              </span>
            ) : (
              <span>
                Best: {d.best_score ?? "—"}
                {d.avg_score != null && ` (avg ${d.avg_score.toFixed(1)})`}
              </span>
            )}
            <span>Event wins: {d.event_wins}</span>
            <span>Podiums: {d.podiums}</span>
          </div>
        </div>
      ))}
      {career.disciplines.length === 0 && (
        <p className="text-sm text-light">No recorded events.</p>
      )}
    </div>
  );
};

export const Leaderboard = ({ leaderboard }) => {
  const [openPlayer, setOpenPlayer] = useState(null);

  if (!leaderboard?.length) return null;

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Leaderboard</h2>
      <div className="overflow-hidden card">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-primary">
              <th className="p-2 w-[40px]">#</th>
              <th className="p-2 text-left">Player</th>
              <th className="p-2 w-[55px]">Pts</th>
              <th className="p-2 w-[45px]" title="Event wins">
                <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
              <th className="p-2 w-[45px]" title="Podiums">
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <React.Fragment key={row.uuid}>
                <tr
                  className={`cursor-pointer ${i % 2 === 0 ? "bg-gray-50" : ""}`}
                  onClick={() =>
                    setOpenPlayer(openPlayer === row.uuid ? null : row.uuid)
                  }
                >
                  <td className="p-2 font-semibold text-center border-t">
                    {i + 1}
                  </td>
                  <td className="p-2 border-t">
                    <div className="flex items-center justify-between">
                      {row.player}
                      {openPlayer === row.uuid ? (
                        <ExpandLessIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center border-t">
                    {Number.isInteger(row.points)
                      ? row.points
                      : row.points.toFixed(1)}
                  </td>
                  <td className="p-2 text-center border-t">{row.event_wins}</td>
                  <td className="p-2 text-center border-t">{row.podiums}</td>
                </tr>
                {openPlayer === row.uuid && (
                  <tr>
                    <td colSpan={5} className="border-t">
                      <PlayerCareer playerUuid={row.uuid} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

/** One all-time leader line: points, then the format-specific detail. */
const leaderLine = (leader, format) => {
  const points = Number.isInteger(leader.points)
    ? leader.points
    : leader.points.toFixed(1);
  let detail = null;
  if (format === "h2h" && leader.games) {
    const record = `${leader.wins}-${leader.losses}${
      leader.ties ? `-${leader.ties}` : ""
    }`;
    detail = `${record} (${Math.round(leader.win_pct * 100)}%)`;
  } else if (format === "ffa" && leader.heats) {
    detail = `${leader.heat_wins} heat win${
      leader.heat_wins === 1 ? "" : "s"
    } in ${leader.heats}`;
  } else if (leader.avg != null) {
    const avg = Number.isInteger(leader.avg)
      ? leader.avg
      : leader.avg.toFixed(1);
    detail = `avg ${avg} (best ${leader.best})`;
  }
  return detail ? `${points} pts · ${detail}` : `${points} pts`;
};

const EventTypeHistory = ({ eventTypeUuid }) => {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    fetchEventTypeHistory(eventTypeUuid)
      .then(setHistory)
      .catch((error) => console.error("Error fetching history:", error));
  }, [eventTypeUuid]);

  if (!history) return <div className="p-2 text-sm text-light">Loading...</div>;

  return (
    <div className="p-2 space-y-3">
      {history.leaders?.length > 0 && (
        <div>
          <h4 className="font-semibold">
            All-Time Leaders
            <span className="ml-2 text-[10px] font-normal text-light">
              by points earned
            </span>
          </h4>
          <div className="space-y-1">
            {history.leaders.map((leader, i) => (
              <div
                className="flex items-center gap-2 text-sm"
                key={leader.who}
              >
                <span className="w-5 font-semibold text-light">{i + 1}.</span>
                <span className="flex-grow">{leader.who}</span>
                <span className="text-light">
                  {leaderLine(leader, history.format)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {history.best_performances.length > 0 && (
        <div>
          <h4 className="font-semibold">
            Best Performances
            <span className="ml-2 text-[10px] font-normal text-light">
              single outing
            </span>
          </h4>
          <div className="space-y-1">
            {history.best_performances.map((row, i) => (
              <div className="flex items-center gap-2 text-sm" key={i + "_best"}>
                <span className="w-5 font-semibold text-light">{i + 1}.</span>
                <span className="flex-grow">{row.who}</span>
                <span className="text-light">
                  {row.score} · {row.brolympics}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {history.years.length > 0 && (
        <div className="pt-2 space-y-3 border-t">
          {history.years.map((year, i) => (
            <div key={i + "_year"}>
              <h4 className="font-semibold">
                {year.brolympics}
                {!year.complete && (
                  <span className="ml-2 text-[10px] text-light">
                    (in progress)
                  </span>
                )}
              </h4>
              <div className="space-y-1">
                {year.podium.map((row) => (
                  <div
                    className="flex items-center gap-2 text-sm"
                    key={row.rank}
                  >
                    <img
                      src={medalFor[row.rank]}
                      alt={`#${row.rank}`}
                      className="h-4"
                    />
                    <span>{row.team}</span>
                  </div>
                ))}
                {year.podium.length === 0 && (
                  <p className="text-sm text-light">No final results.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EventsThroughYears = ({ eventTypes }) => {
  const [openType, setOpenType] = useState(null);

  if (!eventTypes?.length) return null;

  return (
    <section>
      <h2 className="mb-4 header-3">Events Through the Years</h2>
      <div className="space-y-2">
        {eventTypes.map((et) => (
          <div className="card" key={et.uuid}>
            <div
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() => setOpenType(openType === et.uuid ? null : et.uuid)}
            >
              <h3 className="font-semibold">{et.name}</h3>
              {openType === et.uuid ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {openType === et.uuid && (
              <EventTypeHistory eventTypeUuid={et.uuid} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export const Lineages = ({ lineages }) => {
  const duos = lineages?.by_duo || [];
  if (!duos.length) return null;

  return (
    <section>
      <h2 className="mb-4 header-3">Team Lineages</h2>
      <div className="space-y-3">
        {duos.map((duo, i) => (
          <div className="p-4 card" key={i + "_duo"}>
            <h3 className="font-semibold">{duo.players.join(" & ")}</h3>
            <div className="text-sm text-light">
              {duo.appearances.map((a, j) => (
                <p key={j + "_appearance"}>
                  {a.brolympics}:{" "}
                  <span className="text-near-black">{a.team_name}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
