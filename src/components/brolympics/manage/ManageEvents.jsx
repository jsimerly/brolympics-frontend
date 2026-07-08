import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createEvent, defaultStagesFor } from "../../../api/client";

import ManageEvent_h2h from "./events/ManageEvent_h2h.jsx";
import ManageEvent_ind from "./events/ManageEvent_ind.jsx";
import ManageEvent_team from "./events/ManageEvent_team.jsx";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateEvent from "../../create_league_page/events/CreateEvent.jsx";
import RemoveIcon from "@mui/icons-material/Remove";

const ManageEvents = ({ events, setEvents }) => {
  const [addingEvent, setAddingEvent] = useState(false);
  const [compEvents, setCompEvents] = useState(events);
  const { uuid } = useParams();

  const toggleAddEvent = () => {
    setAddingEvent((addingEvent) => !addingEvent);
  };

  const handleEventAdd = async (eventName, type) => {
    try {
      await createEvent({
        brolympics: uuid,
        event_type_name: eventName,
        format: type,
        stages: defaultStagesFor(type),
      });
      setAddingEvent(false);
      location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const CompToType = {
    h2h: <ManageEvent_h2h />,
    ind: <ManageEvent_ind />,
    team: <ManageEvent_team />,
  };

  return (
    <div className="">
      <h2 className="font-bold text-[16px]">Manage Events </h2>
      <div>
        {compEvents &&
          compEvents.map((event, i) => (
            <div key={i + "_comp_events"}>
              {i !== 0 && <div className="w-full h-[1px]" />}
              {React.cloneElement(CompToType[event.type], {
                key: i + "_eventCard",
                event: event,
              })}
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
