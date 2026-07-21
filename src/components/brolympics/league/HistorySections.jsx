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
import PlayerNames from "../../Util/PlayerNames";
import {
  fetchPlayerCareer,
  fetchEventTypeHistory,
} from "../../../api/client";
import { ordinal, trimFloat } from "../../Util/format";
import ShowMore from "../../Util/ShowMore";
import { INITIAL_VISIBLE, nextVisible } from "../../Util/pagination";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

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
  const seconds = career.disciplines
    .filter((d) => d.seconds > 0)
    .map((d) => ({ name: d.event_type, count: d.seconds }));
  const thirds = career.disciplines
    .filter((d) => d.thirds > 0)
    .map((d) => ({ name: d.event_type, count: d.thirds }));
  const records = career.records || [];

  return (
    <div className="p-2 space-y-3">
      <PlayerTeams teams={career.teams} />
      {(wins.length > 0 ||
        seconds.length > 0 ||
        thirds.length > 0 ||
        records.length > 0) && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
          {wins.map((it) => (
            <AchievementChip
              icon={<img src={Gold} alt="" className="h-3.5" />}
              name={it.name}
              count={it.count}
              title="Event wins"
              className="bg-gray-50"
              key={"win_" + it.name}
            />
          ))}
          {seconds.map((it) => (
            <AchievementChip
              icon={<img src={Silver} alt="" className="h-3.5" />}
              name={it.name}
              count={it.count}
              title="Second-place finishes"
              className="bg-gray-50"
              key={"second_" + it.name}
            />
          ))}
          {thirds.map((it) => (
            <AchievementChip
              icon={<img src={Bronze} alt="" className="h-3.5" />}
              name={it.name}
              count={it.count}
              title="Third-place finishes"
              className="bg-gray-50"
              key={"third_" + it.name}
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
              className="text-orange-900 border-orange-300 shadow-sm bg-orange-50"
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

export const Leaderboard = ({ leaderboard, total, onNeedMore }) => {
  const [openPlayer, setOpenPlayer] = useState(null);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  if (!leaderboard?.length) return null;
  const rows = leaderboard.slice(0, visible);
  const showMore = () => {
    const next = nextVisible(visible);
    setVisible(next);
    onNeedMore?.(next); // parent bumps the server-side fetch limit
  };

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Leaderboard</h2>
      <div className="overflow-hidden card">
        <table className="w-full">
          <thead>
            <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
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
            {rows.map((row, i) => (
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
      <ShowMore
        shown={rows.length}
        total={total ?? leaderboard.length}
        onMore={showMore}
      />
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
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  if (!eventTypes?.length) return null;
  const rows = eventTypes.slice(0, visible);

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Events</h2>
      <div className="space-y-2">
        {rows.map((et) => (
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
      <ShowMore
        shown={rows.length}
        total={eventTypes.length}
        onMore={() => setVisible(nextVisible(visible))}
      />
    </section>
  );
};

/** The all-time TEAMS register: every team identity with its whole career.
 * Lineage folds in server-side -- a renamed team is one row wearing its old
 * names as "formerly ...". Tap a row for the year-by-year history. */
export const AllTimeTeams = ({ teams, total, onNeedMore }) => {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [openTeam, setOpenTeam] = useState(null);
  const rows = teams || [];
  if (!rows.length) return null;
  const shown = rows.slice(0, visible);
  const showMore = () => {
    const next = nextVisible(visible);
    setVisible(next);
    onNeedMore?.(next); // parent bumps the server-side fetch limit
  };

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Teams</h2>
      <div className="space-y-2">
        {shown.map((team) => {
          const open = openTeam === team.name;
          return (
            <div className="card" key={team.name}>
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => setOpenTeam(open ? null : team.name)}
              >
                <Img
                  src={team.img}
                  alt={team.name}
                  kind="team"
                  className="object-cover w-10 h-10 rounded-lg shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <h3 className="flex items-center gap-1.5 font-semibold leading-tight">
                    <span className="truncate">{team.name}</span>
                    {team.championships > 0 && (
                      <span className="flex items-center text-xs font-semibold shrink-0 text-secondary-dark">
                        <EmojiEventsOutlinedIcon sx={{ fontSize: 14 }} />
                        {team.championships > 1 && `×${team.championships}`}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] truncate text-light">
                    {team.aka.length > 0 && `formerly ${team.aka.join(", ")} · `}
                    {team.players.join(", ") || "no roster"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">
                    {trimFloat(team.points)} pts
                  </p>
                  <p className="text-[10px] text-light">
                    {team.years} year{team.years === 1 ? "" : "s"}
                  </p>
                </div>
                {open ? (
                  <ExpandLessIcon className="shrink-0 text-light" />
                ) : (
                  <ExpandMoreIcon className="shrink-0 text-light" />
                )}
              </div>
              {open && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="space-y-1.5">
                    {team.appearances.map((a) => (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={a.team_uuid}
                      >
                        {a.rank && a.rank <= 3 ? (
                          <img
                            src={medalFor[a.rank]}
                            alt={ordinal(a.rank)}
                            className="h-4 shrink-0"
                          />
                        ) : (
                          <span className="w-4 text-[10px] text-center shrink-0 text-light">
                            {a.rank ? ordinal(a.rank) : "—"}
                          </span>
                        )}
                        <span className="font-medium shrink-0">
                          {a.brolympics}
                        </span>
                        <span className="min-w-0 truncate text-light">
                          {a.team_name !== team.name && `as ${a.team_name} · `}
                          {a.players.join(", ")}
                        </span>
                        <span className="ml-auto text-xs shrink-0 text-light">
                          {trimFloat(a.points)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="pt-2 text-[10px] text-light">
                    {team.event_wins} event win
                    {team.event_wins === 1 ? "" : "s"} · {team.podiums} podium
                    {team.podiums === 1 ? "" : "s"} all-time
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <ShowMore
        shown={shown.length}
        total={total ?? rows.length}
        onMore={showMore}
      />
    </section>
  );
};
