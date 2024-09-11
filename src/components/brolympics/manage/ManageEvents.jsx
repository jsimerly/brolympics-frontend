import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCreateEvent } from "../../../api/events.js";

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
      const data = await fetchCreateEvent(eventName, type, uuid);
      setCompEvents((prevEvents) => [
        ...prevEvents,
        { name: eventName, type: type },
      ]);
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
              {i !== 0 && <div className="w-full h-[1px] bg-neutralLight" />}
              {React.cloneElement(CompToType[event.type], {
                key: i + "_eventCard",
                event: event,
              })}
            </div>
          ))}
      </div>
      <button
        className="flex gap-3  text-[16px] text-neutralLight"
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
