import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createEvent, defaultStagesFor } from "../../../api/client";

import ManageEvent from "./events/ManageEvent.jsx";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateEvent from "../../create_league_page/events/CreateEvent.jsx";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNotification } from "../../Util/Notification";

const ManageEvents = ({ events, setEvents }) => {
  const [addingEvent, setAddingEvent] = useState(false);
  const [compEvents, setCompEvents] = useState(events);
  const { uuid } = useParams();
  const { showNotification } = useNotification();

  const toggleAddEvent = () => {
    setAddingEvent((addingEvent) => !addingEvent);
  };

  const handleEventAdd = async (eventName, type, stages) => {
    try {
      const created = await createEvent({
        brolympics: uuid,
        event_type_name: eventName,
        format: type,
        stages: stages || defaultStagesFor(type),
      });
      setCompEvents((prevEvents) => [
        ...prevEvents,
        { ...created, type: created.format || type },
      ]);
      setAddingEvent(false);
      if (created.warnings?.length) {
        showNotification(created.warnings.join(" "), "border-yellow-500");
      }
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an error creating this event."
      );
    }
  };

  return (
    <div className="">
      <h2 className="font-bold text-[16px]">Manage Events </h2>
      <div>
        {compEvents &&
          compEvents.map((event, i) => (
            <div key={event.uuid || i + "_comp_events"}>
              {i !== 0 && <div className="w-full h-[1px]" />}
              <ManageEvent event={event} />
            </div>
          ))}
      </div>
      <button
        className="flex gap-3  text-[16px]"
        onClick={toggleAddEvent}
      >
        Add Event
        {addingEvent ? <RemoveIcon /> : <AddCircleOutlineIcon />}
      </button>
      {addingEvent && <CreateEvent handleEventAdded={handleEventAdd} />}
    </div>
  );
};

export default ManageEvents;
