import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { fetchEventInfo } from "../../../api/client";
import useCachedFetch from "../../../hooks/useCachedFetch";
import { SkeletonPage } from "../../Util/Skeleton";
import PillBar from "../../Util/PillBar";

import EventPre from "./EventPre.jsx";
import EventActive from "./EventActive.jsx";

const Events = ({ events, default_uuid, default_type, status, is_admin, league }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();
  const { eventUuid, eventType, uuid } = useParams();

  useEffect(() => {
    const selectEvent = (eventUuid, eventType) => {
      if (events.some((event) => event.uuid === eventUuid)) {
        setSelectedEventId(eventUuid);
        localStorage.setItem(`selectedEventUuid:${uuid}`, eventUuid);
        localStorage.setItem(`selectedEventType:${uuid}`, eventType);
        navigate(`/b/${uuid}/event/${eventType}/${eventUuid}`);
      }
    };

    if (eventUuid && eventType) {
      selectEvent(eventUuid, eventType);
    } else {
      const savedEventUuid = localStorage.getItem(`selectedEventUuid:${uuid}`);
      const savedEventType = localStorage.getItem(`selectedEventType:${uuid}`);

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

  const { data: eventInfo, loading, refreshing } = useCachedFetch(
    selectedEventId ? `event-info:${selectedEventId}` : null,
    () => fetchEventInfo(selectedEventId)
  );

  const handleEventSelect = (selectedEvent) => {
    if (selectedEvent) {
      setSelectedEventId(selectedEvent.uuid);
      localStorage.setItem(`selectedEventUuid:${uuid}`, selectedEvent.uuid);
      localStorage.setItem(`selectedEventType:${uuid}`, selectedEvent.type);
      navigate(`/b/${uuid}/event/${selectedEvent.type}/${selectedEvent.uuid}`);
    }
  };
  const handleEventChange = (e) =>
    handleEventSelect(events.find((event) => event.uuid === e.target.value));

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
        is_admin={is_admin}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PillBar
        items={events.map((event) => ({
          ...event,
          dimmed: event.is_cancelled,
        }))}
        selectedId={selectedEventId}
        onSelect={handleEventSelect}
      />
      {loading || !eventInfo ? (
        <SkeletonPage />
      ) : (
        <div
          className={`transition-opacity duration-200 ${
            refreshing ? "opacity-60" : "opacity-100"
          }`}
        >
          {renderEventComponent()}
        </div>
      )}
      {(() => {
        const selected = events.find((e) => e.uuid === selectedEventId);
        const typeUuid = selected?.event_type?.uuid;
        // the discipline's career page -- tucked under the event, out of the
        // way of game day
        return typeUuid && league && eventInfo ? (
          <div className="flex justify-center pt-2 pb-6">
            <button
              className="flex items-center gap-1 text-xs font-semibold text-light"
              onClick={() =>
                navigate(`/league/${league}/event/${typeUuid}/stats`)
              }
            >
              <QueryStatsIcon sx={{ fontSize: 14 }} /> All-time{" "}
              {selected?.name} stats
            </button>
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default Events;
