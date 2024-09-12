import React, { useState, useEffect } from "react";
import { EventInfo } from "./EventInfo";
import { useParams, useNavigate } from "react-router-dom";

const EventPre = ({ events }) => {
  const { uuid, type, eventUuid } = useParams();
  const navigate = useNavigate();

  const [selectedEventId, setSelectedEventId] = useState(
    eventUuid || events[0]?.uuid || ""
  );

  useEffect(() => {
    if (eventUuid) {
      setSelectedEventId(eventUuid);
    }
  }, [eventUuid]);

  const selectedEvent = events.find((event) => event.uuid === selectedEventId);

  return (
    <div className="max-w-2xl p-2 mx-auto">
      {selectedEvent && <EventInfo event={selectedEvent} />}
    </div>
  );
};

export default EventPre;
