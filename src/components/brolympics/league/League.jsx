import { useRef, useState } from "react";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import Img from "../../Util/Img";
import RingStrip from "../../Util/RingStrip";
import PlayerNames from "../../Util/PlayerNames";
import { fetchLeagueAllTime, fetchEventTypes } from "../../../api/client";
import { Leaderboard, EventsThroughYears, AllTimeTeams } from "./HistorySections";
import { SkeletonPage, SkeletonSection } from "../../Util/Skeleton";
import useCachedFetch from "../../../hooks/useCachedFetch";
import {
  daysUntil,
  formatDateRange,
  formatMonthYear,
} from "../../Util/dates";

/** A running Brolympics: one loud card straight into the action. */
const LiveCard = ({ uuid, name, img }) => {
  const navigate = useNavigate();
  return (
    <div
      className="p-4 border-2 card-clickable border-primary"
      onClick={() => navigate(`/b/${uuid}/home`)}
    >
      <div className="flex items-center gap-4">
        <Img
          src={img}
          alt={name}
          kind="brolympics"
          className="object-cover w-16 h-16 bg-white rounded-lg"
        />
        <div className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-primary" />
            </span>
            Happening now
          </span>
          <h3 className="text-xl font-bold text-near-black">{name}</h3>
        </div>
      </div>
    </div>
  );
};

/** One quiet line: a bold count, then names until the line runs out. */
const SummaryLine = ({ count, noun, names = [] }) => (
  <div className="flex items-baseline gap-2 text-sm">
    <span className="font-semibold shrink-0">
      {count} {noun}
      {count === 1 ? "" : "s"}
    </span>
    <span className="min-w-0 truncate text-light">{names.join(" · ")}</span>
  </div>
);

const UpcomingCard = ({
  img,
  name,
  event_names = [],
  team_names = [],
  projected_start_date,
  projected_end_date,
  uuid,
}) => {
  const navigate = useNavigate();
  const dates = formatDateRange(projected_start_date, projected_end_date);
  const days = daysUntil(projected_start_date);

  return (
    <div
      className="p-4 card-clickable"
      onClick={() => navigate(`/b/${uuid}/home/`)}
    >
      <div className="flex items-center gap-4">
        <Img
          src={img}
          alt={name}
          kind="brolympics"
          className="object-cover w-16 h-16 bg-white rounded-lg shrink-0"
        />
        <div className="flex flex-col justify-center min-w-0 flex-grow">
          <h3 className="header-4 text-near-black">{name}</h3>
          {dates && <div className="text-sm text-light">{dates}</div>}
        </div>
        {days !== null && days >= 0 && (
          <span className="self-start px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 bg-primary/10 text-primary">
            {days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"} out`}
          </span>
        )}
      </div>
      {(event_names.length > 0 || team_names.length > 0) && (
        <div className="pt-3 mt-3 space-y-1 border-t border-gray-100">
          {event_names.length > 0 && (
            <SummaryLine
              count={event_names.length}
              noun="event"
              names={event_names}
            />
          )}
          {team_names.length > 0 && (
            <SummaryLine
              count={team_names.length}
              noun="team"
              names={team_names}
            />
          )}
        </div>
      )}
    </div>
  );
};

const formatWhen = (bro) => {
  const iso =
    bro.end_time || bro.start_time || bro.projected_end_date ||
    bro.projected_start_date;
  if (!iso) return null;
  try {
    return format(parseISO(iso), "MMM yyyy");
  } catch {
    return null;
  }
};

/** One completed year: the champions front and center, silver + bronze below. */
const ChampionCard = ({ bro }) => {
  const navigate = useNavigate();
  const champions = (bro.podium || []).filter((row) => row.rank === 1);
  const runnersUp = (bro.podium || []).filter((row) => row.rank > 1);
  const medalFor = { 2: Silver, 3: Bronze };
  const when = formatWhen(bro);

  return (
    <div
      className="overflow-hidden card-clickable"
      onClick={() => navigate(`/b/${bro.uuid}/home`)}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-light">
          {bro.name}
        </h3>
        {when && <span className="text-xs text-light">{when}</span>}
      </div>
      {champions.map((row) => (
        <div
          className="flex items-center gap-4 px-4 py-3"
          key={row.team.uuid}
        >
          <Img
            src={row.team.img}
            alt={row.team.name}
            className="object-cover w-20 h-20 rounded-lg"
          />
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase text-light">
              <img src={Gold} alt="" className="h-4" /> Champions
            </span>
            <span className="text-2xl font-bold leading-tight text-near-black">
              {row.team.name}
            </span>
            <PlayerNames
              players={row.team.players}
              className="text-sm text-light"
            />
          </div>
        </div>
      ))}
      {champions.length === 0 && (
        <p className="px-4 pb-3 text-sm text-light">No results recorded.</p>
      )}
      {runnersUp.length > 0 && (
        <div className="flex border-t divide-x">
          {runnersUp.map((row) => (
            <div
              className="flex items-center flex-1 gap-2 px-3 py-2"
              key={row.team.uuid}
            >
              <img src={medalFor[row.rank]} alt={`#${row.rank}`} className="h-4" />
              <Img
                src={row.team.img}
                alt={row.team.name}
                className="object-cover w-8 h-8 rounded-md"
              />
              <span className="text-sm font-medium">{row.team.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const League = ({ leagueInfo }) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const isAdmin = !!leagueInfo?.is_admin;
  const founded = formatMonthYear(leagueInfo?.founded);

  // Show More ladder: sections reveal 10 -> 50 -> 100...; the server fetch
  // limit follows the largest request so big leagues never ship full lists.
  const [statsLimit, setStatsLimit] = useState(10);
  const bumpStatsLimit = (next) =>
    setStatsLimit((current) => Math.max(current, next));

  // cached: revisits paint instantly and refresh in the background
  const { data: allTimeLive, loading: loadingAllTime } = useCachedFetch(
    uuid ? `league-alltime:${uuid}:${statsLimit}` : null,
    () => fetchLeagueAllTime(uuid, statsLimit)
  );
  // keep the last payload while a bigger limit loads -- Show More should
  // grow the list in place, never flash a skeleton
  const lastAllTime = useRef(null);
  if (allTimeLive) lastAllTime.current = allTimeLive;
  const allTime = allTimeLive ?? lastAllTime.current;

  const { data: eventTypes, loading: loadingTypes } = useCachedFetch(
    uuid ? `league-eventtypes:${uuid}` : null,
    () => fetchEventTypes(uuid)
  );
  const historyLoading =
    (loadingAllTime && !allTime) || (loadingTypes && !eventTypes);

  if (!leagueInfo) {
    return (
      <div className="w-full max-w-5xl mx-auto container-padding">
        <SkeletonPage />
      </div>
    );
  }

  const { current_brolympics, upcoming_brolympics, completed_brolympics } =
    leagueInfo;

  const nothingScheduled =
    current_brolympics.length === 0 && upcoming_brolympics.length === 0;

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding w-full max-w-5xl mx-auto pb-24">
      <div className="py-6 space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Img
              src={leagueInfo.img}
              alt={leagueInfo.name}
              kind="league"
              className="object-cover w-16 h-16 rounded-xl"
            />
            <div>
              <h1 className="text-3xl font-bold leading-tight text-near-black">
                {leagueInfo.name}
              </h1>
              {founded && <p className="text-sm text-light">Est. {founded}</p>}
              <RingStrip className="w-20 mt-2" />
            </div>
          </div>
          {isAdmin && (
            <Link to="settings" title="League settings">
              <SettingsIcon sx={{ fontSize: 28 }} className="text-light" />
            </Link>
          )}
        </header>

        {current_brolympics.length > 0 && (
          <section className="space-y-4">
            {current_brolympics.map((bro) => (
              <LiveCard {...bro} key={bro.uuid} />
            ))}
          </section>
        )}

        {isAdmin && nothingScheduled && (
          <section className="px-5 py-6 text-center border-2 border-dashed border-gray-300 rounded-xl">
            <h3 className="font-bold text-near-black">
              Nothing on the calendar
            </h3>
            <p className="pt-1 text-sm text-light">
              Line up the next Brolympics and get the invites out.
            </p>
            <button
              className="inline-flex items-center gap-1 px-5 py-2 mt-4 font-semibold text-white transition-colors rounded-full bg-primary hover:bg-primary-dark"
              onClick={() => navigate("create-brolympics")}
            >
              <AddIcon sx={{ fontSize: 20 }} /> Create Brolympics
            </button>
          </section>
        )}

        {upcoming_brolympics.length > 0 && (
          <section>
            <h2 className="mb-4 header-3">Upcoming</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming_brolympics.map((bro) => (
                <UpcomingCard {...bro} key={bro.uuid} />
              ))}
            </div>
          </section>
        )}

        {completed_brolympics.length > 0 && (
          <section>
            <h2 className="mb-4 header-3">Past Champions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completed_brolympics.map((bro) => (
                <ChampionCard bro={bro} key={bro.uuid} />
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {historyLoading ? (
            <>
              <SkeletonSection rows={8} />
              <SkeletonSection rows={5} />
            </>
          ) : (
            <>
              {/* it's a team game: teams first, then the events, then the
                  individuals (commissioner's ordering) */}
              <div className="space-y-8">
                <AllTimeTeams
                  teams={allTime?.teams}
                  total={allTime?.totals?.teams}
                  onNeedMore={bumpStatsLimit}
                />
                <EventsThroughYears eventTypes={eventTypes || []} />
              </div>
              <Leaderboard
                leaderboard={allTime?.leaderboard}
                total={allTime?.totals?.leaderboard}
                onNeedMore={bumpStatsLimit}
              />
            </>
          )}
        </div>
      </div>

      {isAdmin && !nothingScheduled && (
        <button
          className="fixed z-30 flex items-center gap-2 px-5 py-3.5 font-semibold text-white transition-transform rounded-full shadow-lg bottom-6 right-6 bg-primary hover:bg-primary-dark active:scale-95"
          onClick={() => navigate("create-brolympics")}
          title="Create a new Brolympics"
        >
          <AddIcon /> New Brolympics
        </button>
      )}
    </div>
  );
};

export default League;
