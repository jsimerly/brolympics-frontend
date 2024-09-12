import {
  fetchEventsUnstarted,
  fetchStartEvent,
} from "../../../api/activeBro/admin.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";

function formatProjectedStartDate(isoDateString) {
  const date = parseISO(isoDateString);
  return format(date, "MMM d, 'at' h:mm a");
}

const UnstartedEventCard = ({ name, projected_start_date, uuid, type }) => {
  const onStartClick = async () => {
    try {
      const data = await fetchStartEvent(uuid, type);
      location.reload();
    } catch (error) {
      console.log(error);
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
        const data = await fetchEventsUnstarted(uuid);
        setUnstartedEvents(data);
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
