import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StarIcon from "@mui/icons-material/Star";
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
  fetchTeamCareer,
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

/** The chip-noise valve: a trophy case shows its best shelf first. The most
 * impressive chips lead, the rest fold behind a "+N more" toggle. */
const CHIP_PREVIEW = 6;
const ChipOverflow = ({ children, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const chips = React.Children.toArray(children).filter(Boolean);
  if (!chips.length) return null;
  const hidden = chips.length - CHIP_PREVIEW;
  const shown = expanded ? chips : chips.slice(0, CHIP_PREVIEW);
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {shown}
      {hidden > 0 && (
        <button
          className="px-2.5 py-1 text-xs font-semibold border border-dashed border-gray-300 rounded-full text-light"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : `+${hidden} more`}
        </button>
      )}
    </div>
  );
};

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
        <ChipOverflow className="pt-3 border-t border-gray-200">
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
        </ChipOverflow>
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
      <div className="overflow-hidden card">
        <div className="p-2 text-xs tracking-wide text-left uppercase bg-gray-50 text-light">
          Event
        </div>
        {rows.map((et, i) => (
          <React.Fragment key={et.uuid}>
            <div
              className={`flex items-center justify-between p-2 border-t cursor-pointer ${
                i % 2 === 0 ? "bg-gray-50" : ""
              }`}
              onClick={() => setOpenType(openType === et.uuid ? null : et.uuid)}
            >
              <span>{et.name}</span>
              {openType === et.uuid ? (
                <ExpandLessIcon sx={{ fontSize: 18 }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              )}
            </div>
            {openType === et.uuid && (
              <div className="border-t">
                <EventTypeHistory eventTypeUuid={et.uuid} />
              </div>
            )}
          </React.Fragment>
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

/** A team's expand: the all-games record, the trophy shelf, and the year-by-
 * year history. The name IS the lineage -- rosters rotate (and get handed
 * down) under it, so each season line shows who wore the colors that year. */
const TeamHistory = ({ team }) => {
  const { uuid: leagueUuid } = useParams();
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchTeamCareer(leagueUuid, team.name)
      .then(setCareer)
      .catch((error) => console.error("Error fetching team career:", error));
  }, [leagueUuid, team.name]);

  const record = career?.record;
  const games = record ? record.wins + record.losses + record.ties : 0;
  const wins = (career?.disciplines || [])
    .filter((d) => d.event_wins > 0)
    .map((d) => ({ name: d.event_type, count: d.event_wins }));
  const seconds = (career?.disciplines || [])
    .filter((d) => d.seconds > 0)
    .map((d) => ({ name: d.event_type, count: d.seconds }));
  const thirds = (career?.disciplines || [])
    .filter((d) => d.thirds > 0)
    .map((d) => ({ name: d.event_type, count: d.thirds }));

  return (
    <div className="p-2 space-y-3">
      {games > 0 && (
        <p className="text-sm">
          <span className="font-semibold">
            {record.wins}-{record.losses}
            {record.ties ? `-${record.ties}` : ""}
          </span>{" "}
          <span className="text-light">in head-to-head games all-time</span>
        </p>
      )}
      <div className="space-y-1.5">
        {team.appearances.map((a) => (
          <div className="flex items-center gap-2 text-sm" key={a.team_uuid}>
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
            <span className="font-medium shrink-0">{a.brolympics}</span>
            <span className="min-w-0 truncate text-light">
              {a.players.join(", ") || "no roster"}
            </span>
            <span className="ml-auto text-xs shrink-0 text-light">
              {trimFloat(a.points)}
            </span>
          </div>
        ))}
      </div>
      {(wins.length > 0 || seconds.length > 0 || thirds.length > 0) && (
        <ChipOverflow className="pt-3 border-t border-gray-200">
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
        </ChipOverflow>
      )}
    </div>
  );
};

/** The all-time TEAMS register in the leaderboard's visual language: same
 * table, same columns -- one row per team NAME with its whole career. */
export const AllTimeTeams = ({ teams, total, onNeedMore }) => {
  const [openTeam, setOpenTeam] = useState(null);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  if (!teams?.length) return null;
  const rows = teams.slice(0, visible);
  const showMore = () => {
    const next = nextVisible(visible);
    setVisible(next);
    onNeedMore?.(next); // parent bumps the server-side fetch limit
  };

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Teams</h2>
      <div className="overflow-hidden card">
        <table className="w-full">
          <thead>
            <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
              <th className="p-2 w-[40px]">#</th>
              <th className="p-2 text-left">Team</th>
              <th className="p-2 w-[55px]">Pts</th>
              {/* same icons, same meanings as the player table */}
              <th className="p-2 w-[45px]" title="Event wins">
                <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
              <th className="p-2 w-[45px]" title="Podiums">
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team, i) => (
              <React.Fragment key={team.name}>
                <tr
                  className={`cursor-pointer ${i % 2 === 0 ? "bg-gray-50" : ""}`}
                  onClick={() =>
                    setOpenTeam(openTeam === team.name ? null : team.name)
                  }
                >
                  <td className="p-2 font-semibold text-center border-t">
                    {i + 1}
                  </td>
                  <td className="p-2 border-t">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center min-w-0 gap-2">
                        <Img
                          src={team.img}
                          alt={team.name}
                          kind="team"
                          className="object-cover w-6 h-6 rounded shrink-0"
                        />
                        <span className="truncate">{team.name}</span>
                        {team.championships > 0 && (
                          <span
                            className="flex items-center text-xs font-semibold shrink-0 text-secondary-dark"
                            title="League championships"
                          >
                            <StarIcon sx={{ fontSize: 14 }} />
                            {team.championships > 1 &&
                              `×${team.championships}`}
                          </span>
                        )}
                      </span>
                      {openTeam === team.name ? (
                        <ExpandLessIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center border-t">
                    {trimFloat(team.points)}
                  </td>
                  <td className="p-2 text-center border-t">
                    {team.event_wins}
                  </td>
                  <td className="p-2 text-center border-t">
                    {team.podiums}
                  </td>
                </tr>
                {openTeam === team.name && (
                  <tr>
                    <td colSpan={5} className="border-t">
                      <TeamHistory team={team} />
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
        total={total ?? teams.length}
        onMore={showMore}
      />
    </section>
  );
};
