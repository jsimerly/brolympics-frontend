import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import Img from "../../Util/Img";
import {
  fetchPlayerCareer,
  fetchEventTypeHistory,
} from "../../../api/client";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const ordinal = (n) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

/** Chips for every team a player has suited up for. Podium years always get
 * their medal; non-podium ordinals ("5th") only show when showAllFinishes --
 * the stats page tells the whole truth, the league page spares feelings. */
export const PlayerTeams = ({ teams, showAllFinishes = false }) => {
  const shown = teams || [];
  if (!shown.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((row, i) => (
        <div
          className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 text-xs bg-white border rounded-full"
          key={i + "_played_for"}
        >
          <Img
            src={row.img}
            alt={row.team}
            className="object-cover w-5 h-5 rounded-full"
          />
          <span className="font-medium">{row.team}</span>
          <span className="text-light">{row.brolympics}</span>
          {row.finish && row.finish <= 3 ? (
            <img
              src={medalFor[row.finish]}
              alt={ordinal(row.finish)}
              className="h-3.5"
            />
          ) : row.finish && showAllFinishes ? (
            <span className="text-light">{ordinal(row.finish)}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

/** Achievement chips in the same visual language as the team chips: an icon,
 * the event, and a ×count when it happened more than once. */
const AchievementChip = ({ icon, name, count = 1, title, className = "" }) => (
  <div
    className={`flex items-center gap-1 pl-1.5 pr-2.5 py-1 text-xs border rounded-full ${
      className || "bg-white"
    }`}
    title={title}
  >
    {icon}
    <span className="font-medium">{name}</span>
    {count > 1 && <span className="text-light">×{count}</span>}
  </div>
);

/** The leaderboard expand: a highlight reel, not the full record. Medal
 * finishes, event wins/podiums, records held -- details live on the stats
 * page. */
const PlayerCareer = ({ playerUuid }) => {
  const [career, setCareer] = useState(null);
  const navigate = useNavigate();
  const { uuid: leagueUuid } = useParams();

  useEffect(() => {
    fetchPlayerCareer(playerUuid)
      .then(setCareer)
      .catch((error) => console.error("Error fetching career:", error));
  }, [playerUuid]);

  if (!career) return <div className="p-2 text-sm text-light">Loading...</div>;

  const wins = career.disciplines
    .filter((d) => d.event_wins > 0)
    .map((d) => ({ name: d.event_type, count: d.event_wins }));
  // podium chips only count finishes beyond the wins already shown
  const podiums = career.disciplines
    .filter((d) => d.podiums - d.event_wins > 0)
    .map((d) => ({ name: d.event_type, count: d.podiums - d.event_wins }));
  const records = career.records || [];

  return (
    <div className="p-2 space-y-2">
      <PlayerTeams teams={career.teams} />
      {(wins.length > 0 || podiums.length > 0 || records.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {wins.map((it) => (
            <AchievementChip
              icon={
                <EmojiEventsOutlinedIcon
                  sx={{ fontSize: 14 }}
                  className="text-yellow-500"
                />
              }
              name={it.name}
              count={it.count}
              title="Event wins"
              key={"win_" + it.name}
            />
          ))}
          {podiums.map((it) => (
            <AchievementChip
              icon={
                <WorkspacePremiumOutlinedIcon
                  sx={{ fontSize: 14 }}
                  className="text-gray-400"
                />
              }
              name={it.name}
              count={it.count}
              title="Podium finishes"
              key={"podium_" + it.name}
            />
          ))}
          {records.map((r) => (
            <AchievementChip
              icon={
                <WhatshotOutlinedIcon
                  sx={{ fontSize: 14 }}
                  className="text-orange-500"
                />
              }
              name={`${r.event_type} · ${r.score}`}
              title="All-time record"
              className="bg-orange-50 border-orange-300 text-orange-900 shadow-sm"
              key={"record_" + r.event_type}
            />
          ))}
        </div>
      )}
      <button
        className="flex items-center justify-center w-full gap-1 px-4 py-2 text-sm font-semibold transition-colors border rounded-full text-primary border-primary hover:bg-primary hover:text-white"
        onClick={() =>
          navigate(`/league/${leagueUuid}/player/${playerUuid}/stats`)
        }
      >
        View full stats <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </button>
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
      {history.best_seasons?.length > 0 && (
        <div>
          <h4 className="font-semibold">
            Best Performances
            <span className="ml-2 text-[10px] font-normal text-light">
              single season
            </span>
          </h4>
          <div className="space-y-1">
            {history.best_seasons.map((row, i) => (
              <div
                className="flex items-center gap-2 text-sm"
                key={i + "_season"}
              >
                <span className="w-5 font-semibold text-light">{i + 1}.</span>
                <span className="flex-grow">{row.who}</span>
                <span className="text-light">
                  {row.wins}-{row.losses}
                  {row.ties ? `-${row.ties}` : ""} (
                  {Math.round(row.win_pct * 100)}%) · {row.brolympics}
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
