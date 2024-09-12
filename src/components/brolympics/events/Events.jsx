import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventInfo } from "../../../api/activeBro/events.js";

import EventPre from "./EventPre.jsx";
import EventActive from "./EventActive.jsx";

const Events = ({ events, default_uuid, default_type, status }) => {
  const [eventInfo, setEventInfo] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();
  const { eventUuid, eventType, uuid } = useParams();

  useEffect(() => {
    const savedEventUuid = localStorage.getItem("selectedEventUuid");
    const savedEventType = localStorage.getItem("selectedEventType");

    if (eventUuid && eventType) {
      setSelectedEventId(eventUuid);
    } else if (savedEventUuid && savedEventType) {
      navigate(`/b/${uuid}/event/${savedEventType}/${savedEventUuid}`);
    } else if (default_uuid && default_type) {
      navigate(`/b/${uuid}/event/${default_type}/${default_uuid}`);
    } else if (events.length > 0) {
      const firstEvent = events[0];
      navigate(`/b/${uuid}/event/${firstEvent.type}/${firstEvent.uuid}`);
    }
  }, [eventUuid, eventType, uuid]);

  useEffect(() => {
    const getEventInfo = async () => {
      if (selectedEventId) {
        try {
          const data = await fetchEventInfo(selectedEventId, eventType);
          setEventInfo(data);
        } catch (error) {
          console.error("Error fetching event info:", error);
        }
      }
    };
    getEventInfo();
  }, [selectedEventId, eventType]);

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.uuid === e.target.value);
    if (selectedEvent) {
      localStorage.setItem("selectedEventUuid", selectedEvent.uuid);
      localStorage.setItem("selectedEventType", selectedEvent.type);
      navigate(`/b/${uuid}/event/${selectedEvent.type}/${selectedEvent.uuid}`);
    }
  };

  const renderEventComponent = () => {
    if (status === "pre" || status === "pre_admin") {
      return (
        <EventPre
          events={events}
          onEventChange={handleEventChange}
          selectedEventId={selectedEventId}
        />
      );
    }
    return (
      <EventActive
        events={events}
        eventInfo={eventInfo}
        onEventChange={handleEventChange}
        selectedEventId={selectedEventId}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-2 mb-4">
        <label
          htmlFor="event-select"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Select an event:
        </label>
        <select
          id="event-select"
          value={selectedEventId || ""}
          onChange={handleEventChange}
          className="block w-full p-2 text-2xl bg-white border rounded-md shadow-sm border-secondary focus:outline-none focus:ring-secondary focus:border-secondary"
        >
          {events.map((event) => (
            <option key={event.uuid} value={event.uuid}>
              {event.name}
            </option>
          ))}
        </select>
      </div>
      {renderEventComponent()}
    </div>
  );
};

export default Events;
