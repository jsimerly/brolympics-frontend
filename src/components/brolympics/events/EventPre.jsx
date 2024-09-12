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

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.uuid === e.target.value);
    if (selectedEvent) {
      localStorage.setItem("selectedEventUuid", selectedEvent.uuid);
      localStorage.setItem("selectedEventType", selectedEvent.type);
      navigate(`/b/${uuid}/event/${selectedEvent.type}/${selectedEvent.uuid}`);
    }
  };

  const selectedEvent = events.find((event) => event.uuid === selectedEventId);

  return (
    <div className="max-w-2xl p-2 mx-auto">
      <div className="mb-4">
        <label
          htmlFor="event-select"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Select an event:
        </label>
        <select
          id="event-select"
          value={selectedEventId}
          onChange={handleEventChange}
          className="block w-full p-2 text-2xl bg-white border rounded-md shadow-sm border-secondary focus:outline-none focus:ring-secondary focus:border-secondary"
        >
          {events.map((event) => (
            <option className="text-sm" key={event.uuid} value={event.uuid}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && <EventInfo event={selectedEvent} />}
    </div>
  );
};

export default EventPre;
