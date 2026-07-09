import { fetchBrolympicsEvents, startEvent, endBrolympics } from "../../../api/client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNotification } from "../../Util/Notification";
import PopupContinue from "../../Util/PopupContinue";

function formatProjectedStartDate(isoDateString) {
  if (!isoDateString) {
    return "Not scheduled";
  }
  const date = parseISO(isoDateString);
  return format(date, "MMM d, 'at' h:mm a");
}

const UnstartedEventCard = ({ name, projected_start_date, uuid }) => {
  const { showNotification } = useNotification();

  const onStartClick = async () => {
    try {
      await startEvent(uuid);
      location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail ? String(detail[0] ?? detail) : `Unable to start ${name}.`
      );
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="min-w-0">
        <h2 className="font-semibold truncate">{name}</h2>
        <p className="text-xs text-light">
          {formatProjectedStartDate(projected_start_date)}
        </p>
      </div>
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white rounded-full shrink-0 bg-primary"
        onClick={onStartClick}
      >
        <PlayArrowIcon sx={{ fontSize: 18 }} /> Start
      </button>
    </div>
  );
};

const HomeAdminActive = () => {
  const { pathname } = useLocation();
  const uuid = pathname.split("/")[2];
  const { showNotification } = useNotification();
  const [endOpen, setEndOpen] = useState(false);

  const [unstartedEvents, setUnstartedEvents] = useState([]);
  useEffect(() => {
    const getUnstartedEvents = async () => {
      try {
        const events = await fetchBrolympicsEvents(uuid);
        setUnstartedEvents(
          events.filter(
            (e) => !e.is_active && !e.is_complete && !e.is_cancelled
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    getUnstartedEvents();
  }, []);

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-lg font-bold">Ready to Start</h2>
        {unstartedEvents.length > 0 ? (
          <div className="space-y-2">
            {unstartedEvents.map((event, i) => (
              <UnstartedEventCard {...event} key={i + "_unstarted_events"} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-light">
            Every event is underway or finished.
          </p>
        )}
      </div>

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

export default HomeAdminActive;
