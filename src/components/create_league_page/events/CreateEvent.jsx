import { useState, useEffect } from "react";

import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";

const CreateEvent = ({ handleEventAdded }) => {
  const [selectedType, setSelectedType] = useState("ind");
  const [eventName, setEventName] = useState("");

  const addClicked = async () => {
    handleEventAdded(eventName, selectedType);
    setEventName("");
  };

  const TypeCard = ({ e_type, description, examples, Icon }) => (
    <div className="flex w-full h-[115px] rounded-md p-2 border bg-white">
      <div className="w-[80px] text-neutral flex justify-center items-center mr-3">
        <Icon sx={{ fontSize: 60 }} />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div>
          <h3 className="font-bold">{e_type}</h3>
          <p className="text-[10px]">{description}</p>
        </div>
        <div className="flex items-center">
          <EmojiObjectsOutlinedIcon sx={{ fontSize: 20 }} />
          <p className="ml-1">{examples}</p>
        </div>
      </div>
    </div>
  );

  const handleIndClick = () => {
    setSelectedType("ind");
  };
  const handleH2hClick = () => {
    setSelectedType("h2h");
  };
  const handleTeamClick = () => {
    setSelectedType("team");
  };

  const getEventText = () => {
    if (selectedType === "ind") {
      return "Individual Event";
    }
    if (selectedType === "h2h") {
      return "Head to Head Event";
    }
    if (selectedType === "team") {
      return "Team Event";
    }
    return "";
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div>
        <h3>Event Name *</h3>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter the name of your league"
          className="w-full p-2 border border-gray-200 rounded-md"
        />
      </div>
      <div>
        <h2 className="font-bold">Event Type</h2>
        <p className="text-[12px]">
          {" "}
          Select the type of event you're trying to register.
        </p>
      </div>
      <div
        onClick={handleIndClick}
        className={`${
          selectedType == "ind"
            ? "outline rounded-md outline-tertiary outline-2"
            : ""
        }`}
      >
        <TypeCard
          e_type="Individual Event"
          description={
            "Events where everyone will compete independant of eachother; each partner's scores are then combined or averaged to determine a winner."
          }
          examples={"Bowling, Golf, Go-Karting"}
          Icon={PersonIcon}
        />
      </div>
      <div
        onClick={handleH2hClick}
        className={`${
          selectedType == "h2h"
            ? "outline rounded-md outline-tertiary outline-2"
            : ""
        }`}
      >
        <TypeCard
          e_type="Head to Head Event"
          description={
            "Events where teams will compete against eachother directly. These competitions can be by points or win/loss."
          }
          examples={"Cornhole, Tug-o-War, Tennis"}
          Icon={SportsKabaddiIcon}
        />
      </div>

      <div
        onClick={handleTeamClick}
        className={`${
          selectedType == "team"
            ? "outline rounded-md outline-tertiary outline-2"
            : ""
        }`}
      >
        <TypeCard
          e_type="Team Event"
          description={
            "Events where both partners will work towards a combined goal and the team only has 1 score."
          }
          examples={"Trivia, Rowing, Relay Races"}
          Icon={GroupIcon}
        />
      </div>
      <button className="tertiary-btn" onClick={addClicked}>
        Add {getEventText()}
      </button>
    </div>
  );
};

export default CreateEvent;
