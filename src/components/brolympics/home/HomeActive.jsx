import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AvailableCompetition from "./AvailableCompetition.jsx";
import ActiveCompetition from "./ActiveCompetition.jsx";
import PopupContinue from "../../Util/PopupContinue";
import { useNotification } from "../../Util/Notification";
import {
  fetchActiveHome,
  confirmContest,
  startEvent,
  endBrolympics,
} from "../../../api/client";

/** A self-reported result from the other side, waiting on my word. */
const ConfirmCard = ({ uuid, event_name, entries = [], recorded_by_name }) => {
  const [busy, setBusy] = useState(false);
  const [entry_1, entry_2] = entries;
  const scoreOf = (entry) =>
    entry?.score ?? ({ w: "W", l: "L", t: "T" }[entry?.outcome] || "—");

  const confirm = async () => {
    setBusy(true);
    try {
      await confirmContest(uuid);
      location.reload();
    } catch (error) {
      if (error.response?.status === 400) {
        // someone else confirmed first -- refresh shows it settled
        location.reload();
        return;
      }
      console.error("Error confirming result:", error);
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="min-w-0">
        <h3 className="font-semibold">{event_name}</h3>
        <p className="text-sm text-light">
          {entry_1?.team_name} {scoreOf(entry_1)} : {scoreOf(entry_2)}{" "}
          {entry_2?.team_name}
        </p>
        <p className="text-xs text-light">
          recorded by {recorded_by_name} — wrong? ask your commissioner to undo
          it
        </p>
      </div>
      <button
        className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-tertiary shrink-0 disabled:opacity-50"
        onClick={confirm}
        disabled={busy}
      >
        {busy ? "..." : "Confirm"}
      </button>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h2 className="mb-2 text-lg font-bold">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

/** A running event: name, live chip, how much of it is scored. */
const LiveEventCard = ({ event, onClick }) => (
  <button
    className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg"
    onClick={onClick}
  >
    <div className="flex items-center justify-between pb-2">
      <h3 className="font-semibold">{event.name}</h3>
      <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
        live
      </span>
    </div>
    <div className="relative w-full h-1.5 overflow-hidden bg-gray-100 rounded-full">
      <div
        className="absolute top-0 left-0 h-full transition-all duration-300 bg-primary"
        style={{ width: `${event.percent_complete}%` }}
      />
    </div>
    <span className="text-xs text-light">
      {event.percent_complete}% scored
    </span>
  </button>
);

const whenLabel = (event) => {
  if (!event.projected_start_date) return "Play anytime";
  try {
    return format(parseISO(event.projected_start_date), "EEE h:mm a");
  } catch {
    return "Play anytime";
  }
};

/** An unstarted event: players see the time, admins get the Start button. */
const UpNextRow = ({ event, isAdmin, onOpen, onStart }) => (
  <div className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg">
    <button className="flex-grow min-w-0 text-left" onClick={onOpen}>
      <h3 className="text-sm font-semibold truncate">{event.name}</h3>
      <p className="text-xs text-light">{whenLabel(event)}</p>
    </button>
    {isAdmin && (
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white rounded-full shrink-0 bg-primary"
        onClick={onStart}
      >
        <PlayArrowIcon sx={{ fontSize: 18 }} /> Start
      </button>
    )}
  </div>
);

/** One page for everyone: what needs you, what's live, what's next. Admins
 * get their powers inline -- Start on the next event, End at the bottom. */
const HomeActive = ({ is_admin }) => {
  const [homeData, setHomeData] = useState({
    active_events: [],
    available_competitions: [],
    active_competitions: [],
    upcoming_events: [],
    pending_confirmations: [],
  });
  const [endOpen, setEndOpen] = useState(false);
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const getHomeInfo = async () => {
      try {
        const data = await fetchActiveHome(uuid);
        setHomeData(data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    getHomeInfo();
  }, [uuid]);

  const openEvent = (event) =>
    navigate(`/b/${uuid}/event/${event.format || event.type}/${event.uuid}`);

  const startEventClick = async (event) => {
    try {
      await startEvent(event.uuid);
      location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : `Unable to start ${event.name}.`
      );
    }
  };

  const endBro = async () => {
    try {
      await endBrolympics(uuid);
      location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail.detail ?? detail[0] ?? detail)
          : "There was an error ending the Brolympics."
      );
    }
  };

  const {
    pending_confirmations: pending = [],
    available_competitions: available = [],
    active_competitions: inProgress = [],
    active_events: liveEvents = [],
    upcoming_events: upNext = [],
  } = homeData;

  const nothingDoing =
    pending.length === 0 &&
    available.length === 0 &&
    inProgress.length === 0 &&
    liveEvents.length === 0 &&
    upNext.length === 0;

  return (
    <div className="max-w-md px-4 py-6 mx-auto space-y-6 sm:px-6 lg:px-8">
      {pending.length > 0 && (
        <Section title="Unconfirmed Results">
          {pending.map((contest) => (
            <ConfirmCard {...contest} key={contest.uuid} />
          ))}
        </Section>
      )}

      {available.length > 0 && (
        <Section title="Your Games">
          {available.map((contest) => (
            <AvailableCompetition {...contest} key={contest.uuid} />
          ))}
        </Section>
      )}

      {inProgress.length > 0 && (
        <Section title="In Progress">
          {inProgress.map((contest) => (
            <ActiveCompetition {...contest} key={contest.uuid} />
          ))}
        </Section>
      )}

      {liveEvents.length > 0 && (
        <Section title="Live Events">
          {liveEvents.map((event) => (
            <LiveEventCard
              event={event}
              onClick={() => openEvent(event)}
              key={event.uuid}
            />
          ))}
        </Section>
      )}

      {upNext.length > 0 && (
        <Section title="Up Next">
          {upNext.map((event) => (
            <UpNextRow
              event={event}
              isAdmin={is_admin}
              onOpen={() => openEvent(event)}
              onStart={() => startEventClick(event)}
              key={event.uuid}
            />
          ))}
        </Section>
      )}

      {nothingDoing && (
        <p className="py-8 text-sm text-center text-light">
          Nothing waiting on you — go heckle somebody.
        </p>
      )}

      {is_admin && (
        <div className="p-3 border rounded-lg border-red/30">
          <h4 className="text-sm font-semibold text-red">Wrap It Up</h4>
          <p className="text-[11px] text-light">
            Ending the Brolympics freezes the standings where they sit, closes
            every event, and clears everyone's open games.
          </p>
          <button
            className="w-full py-2 mt-2 text-sm font-semibold border rounded-full text-red border-red"
            onClick={() => setEndOpen(true)}
          >
            End Brolympics
          </button>
        </div>
      )}

      <PopupContinue
        open={endOpen}
        setOpen={setEndOpen}
        header="End the Brolympics?"
        desc="The games are over: standings freeze, events close, and unplayed games go away. There's no restart button."
        continueText="End it"
        continueFunc={endBro}
      />
    </div>
  );
};

export default HomeActive;
