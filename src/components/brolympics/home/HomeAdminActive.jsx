import { fetchBrolympicsEvents, startEvent } from "../../../api/client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useNotification } from "../../Util/Notification";

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
    <div className="flex items-center justify-between p-3 border rounded-md border-primary">
      <div>
        <h2 className="font-semibold">{name}</h2>

        {formatProjectedStartDate(projected_start_date)}
      </div>
      <button className="min-w-[100px] primary-btn" onClick={onStartClick}>
        Start
      </button>
    </div>
  );
};

const HomeAdminActive = () => {
  const { pathname } = useLocation();
  const uuid = pathname.split("/")[2];

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

  return (
    <div>
      <div className="space-y-3">
        {unstartedEvents.map((event, i) => (
          <UnstartedEventCard {...event} key={i + "_unstarted_events"} />
        ))}
      </div>
    </div>
  );
};

export default HomeAdminActive;
