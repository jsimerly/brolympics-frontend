import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { useDropdown } from "../../../hooks";

const EventDropdown = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const savedEventUuid = localStorage.getItem("selectedEventUuid");

  useEffect(() => {
    if (events) {
      const savedEvent = events.find((event) => event.uuid === savedEventUuid);
      setSelectedEvent(savedEvent || events[0]);
    }
  }, [events]);

  const handleSelect = (event) => {
    setSelectedEvent(event);
    localStorage.setItem("selectedEventUuid", event.uuid);
    localStorage.setItem("selectedEventType", event.type);
    setIsOpen(false);
    navigate(`/b/${uuid}/event/${event.type}/${event.uuid}`);
  };

  const [isOpen, setIsOpen, handleDropdownClicked, dropdownNode] =
    useDropdown();

  const getEventText = (event) => {
    if (event.is_active) {
      return "";
    } else if (event.is_complete) {
      return "text-primaryLight";
    } else {
      return "text-neutralLight";
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center w-full py-3 ">
      <div>
        <div
          className=" flex justify-between items-center w-[200px] text-[20px] font-bold"
          onClick={handleDropdownClicked}
        >
          <h2 className="flex items-center justify-center w-full text-center">
            {selectedEvent ? selectedEvent.name : "Select a Event"}
          </h2>
          <ExpandMoreOutlinedIcon />
        </div>
        {isOpen && (
          <ul
            className="absolute top-[50px] border p-2 rounded-md shadow-lg w-[200px] z-10"
            ref={dropdownNode}
          >
            {events
              .filter((event) => event !== selectedEvent)
              .map((event, index) => (
                <div key={index + "_dropdown"}>
                  {index !== 0 && (
                    <div
                      key={index + "_divider"}
                      className="w-full bg-gray-200 h-[1px]"
                    />
                  )}
                  <li
                    key={index + "_event"}
                    className={`text-[16px] py-2 ${getEventText(event)}`}
                    onClick={() => handleSelect(event)}
                  >
                    {event.name}
                  </li>
                </div>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventDropdown;
