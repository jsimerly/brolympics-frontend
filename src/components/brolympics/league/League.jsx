import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import Img from "../../Util/Img";
import RingStrip from "../../Util/RingStrip";
import PlayerNames from "../../Util/PlayerNames";
import { fetchLeagueAllTime, fetchEventTypes } from "../../../api/client";
import { Leaderboard, EventsThroughYears, Lineages } from "./HistorySections";

const formatFounded = (iso) => {
  if (!iso) return null;
  try {
    return format(parseISO(iso), "MMMM yyyy");
  } catch {
    return null;
  }
};

const formatDateRange = (start, end) => {
  const fmt = (d) => format(parseISO(d), "MMM d");
  try {
    if (start && end) return `${fmt(start)} – ${fmt(end)}`;
    return start ? fmt(start) : end ? fmt(end) : null;
  } catch {
    return null;
  }
};

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

const UpcomingCard = ({
  img,
  name,
  event_names,
  team_names,
  projected_start_date,
  projected_end_date,
  uuid,
}) => {
  const navigate = useNavigate();
  const dates = formatDateRange(projected_start_date, projected_end_date);

  return (
    <div className="p-4 card-clickable" onClick={() => navigate(`/b/${uuid}/home/`)}>
      <div className="flex items-center gap-4 mb-3">
        <Img
          src={img}
          alt={name}
          kind="brolympics"
          className="object-cover w-16 h-16 bg-white rounded-lg"
        />
        <div className="flex flex-col justify-center">
          <h3 className="header-4 text-near-black">{name}</h3>
          {dates && <div className="text-sm text-light">{dates}</div>}
        </div>
      </div>
      {event_names?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {event_names.map((eventName, i) => (
            <div
              className="px-2 py-1 text-sm border rounded-md border-primary"
              key={i + "bro_card_event"}
            >
              {eventName}
            </div>
          ))}
        </div>
      )}
      {team_names?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {team_names.map((teamName, i) => (
            <div
              className="px-2 py-1 text-sm border rounded-md border-tertiary"
              key={i + "bro_card_team"}
            >
              {teamName}
            </div>
          ))}
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
  const [allTime, setAllTime] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const isAdmin = !!leagueInfo?.is_admin;
  const founded = formatFounded(leagueInfo?.founded);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const [allTimeData, types] = await Promise.all([
          fetchLeagueAllTime(uuid),
          fetchEventTypes(uuid),
        ]);
        setAllTime(allTimeData);
        setEventTypes(types);
      } catch (error) {
        console.error("Error fetching league history:", error);
      }
    };
    getHistory();
  }, [uuid]);

  if (!leagueInfo) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
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
          <Leaderboard leaderboard={allTime?.leaderboard} />
          <div className="space-y-8">
            <EventsThroughYears eventTypes={eventTypes} />
            <Lineages lineages={allTime?.team_lineages} />
          </div>
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
