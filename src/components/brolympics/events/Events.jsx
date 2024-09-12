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
    const selectEvent = (eventUuid, eventType) => {
      if (events.some((event) => event.uuid === eventUuid)) {
        setSelectedEventId(eventUuid);
        localStorage.setItem("selectedEventUuid", eventUuid);
        localStorage.setItem("selectedEventType", eventType);
        navigate(`/b/${uuid}/event/${eventType}/${eventUuid}`);
      }
    };

    if (eventUuid && eventType) {
      selectEvent(eventUuid, eventType);
    } else {
      const savedEventUuid = localStorage.getItem("selectedEventUuid");
      const savedEventType = localStorage.getItem("selectedEventType");

      if (
        savedEventUuid &&
        savedEventType &&
        events.some((event) => event.uuid === savedEventUuid)
      ) {
        selectEvent(savedEventUuid, savedEventType);
      } else if (default_uuid && default_type) {
        selectEvent(default_uuid, default_type);
      } else if (events.length > 0) {
        const firstEvent = events[0];
        selectEvent(firstEvent.uuid, firstEvent.type);
      }
    }
  }, [
    events,
    eventUuid,
    eventType,
    uuid,
    default_uuid,
    default_type,
    navigate,
  ]);

  useEffect(() => {
    const getEventInfo = async () => {
      if (selectedEventId && eventType) {
        try {
          const data = await fetchEventInfo(selectedEventId, eventType);
          setEventInfo(data); // Set the eventInfo state with the fetched data
        } catch (error) {
          console.error("Error fetching event info:", error);
          setEventInfo(null); // Reset eventInfo on error
        }
      }
    };
    getEventInfo();
  }, [selectedEventId, eventType]);

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.uuid === e.target.value);
    if (selectedEvent) {
      setSelectedEventId(selectedEvent.uuid);
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
      {eventInfo ? (
        renderEventComponent()
      ) : (
        <div>Loading event information...</div>
      )}
    </div>
  );
};

export default Events;
