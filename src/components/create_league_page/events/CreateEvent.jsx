import { useState } from "react";

import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";

const CreateEvent = ({ handleEventAdded }) => {
  const [selectedType, setSelectedType] = useState("ind");
  const [eventName, setEventName] = useState("");
  // h2h structure choices; other formats have one natural structure.
  const [groupPlay, setGroupPlay] = useState("round_robin");
  const [groupGames, setGroupGames] = useState("4");
  const [playoffTake, setPlayoffTake] = useState("4");

  const buildStages = () => {
    if (selectedType === "ffa") return [{ structure: "heats", config: {} }];
    if (selectedType !== "h2h") return [{ structure: "open_play", config: {} }];

    const stages = [];
    const n = Number(groupGames) || 4;
    if (groupPlay === "round_robin") {
      stages.push({ structure: "round_robin", config: { games_per_team: n } });
    } else if (groupPlay === "swiss") {
      stages.push({ structure: "swiss", config: { rounds: n } });
    }
    if (playoffTake !== "none" || stages.length === 0) {
      const config = { third_place: true, byes: "seeded" };
      if (playoffTake !== "all" && playoffTake !== "none") {
        config.take = Number(playoffTake);
      }
      stages.push({ structure: "knockout", config });
    }
    return stages;
  };

  const addClicked = async () => {
    handleEventAdded(eventName, selectedType, buildStages());
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

  const typeCards = [
    {
      type: "ind",
      e_type: "Individual Event",
      description:
        "Events where everyone will compete independant of eachother; each partner's scores are then combined or averaged to determine a winner.",
      examples: "Bowling, Golf, Darts",
      Icon: PersonIcon,
    },
    {
      type: "h2h",
      e_type: "Head to Head Event",
      description:
        "Events where teams will compete against eachother directly. These competitions can be by points or win/loss.",
      examples: "Cornhole, Tug-o-War, Tennis",
      Icon: SportsKabaddiIcon,
    },
    {
      type: "team",
      e_type: "Team Event",
      description:
        "Events where both partners will work towards a combined goal and the team only has 1 score.",
      examples: "Trivia, Rowing, Relay Races",
      Icon: GroupIcon,
    },
    {
      type: "ffa",
      e_type: "Free-for-All Event",
      description:
        "Everyone competes at once in heats; placements earn points toward the event standings.",
      examples: "Mario Kart, Foot Races, Poker",
      Icon: SportsMotorsportsIcon,
    },
  ];

  const eventText = {
    ind: "Individual Event",
    h2h: "Head to Head Event",
    team: "Team Event",
    ffa: "Free-for-All Event",
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div>
        <h3>Event Name *</h3>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter the name of your event"
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
      {typeCards.map((card) => (
        <div
          key={card.type}
          onClick={() => setSelectedType(card.type)}
          className={`${
            selectedType === card.type
              ? "outline rounded-md outline-tertiary outline-2"
              : ""
          }`}
        >
          <TypeCard
            e_type={card.e_type}
            description={card.description}
            examples={card.examples}
            Icon={card.Icon}
          />
        </div>
      ))}

      {selectedType === "h2h" && (
        <div className="p-3 bg-white border rounded-md space-y-3">
          <h3 className="font-bold">Structure</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Group Play</h4>
              <p className="text-[10px]">
                How teams are matched before the playoffs.
              </p>
            </div>
            <select
              value={groupPlay}
              onChange={(e) => setGroupPlay(e.target.value)}
              className="p-2 border rounded-md border-primary bg-white"
            >
              <option value="round_robin">Round Robin</option>
              <option value="swiss">Swiss</option>
              <option value="none">None (bracket only)</option>
            </select>
          </div>
          {groupPlay !== "none" && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">
                  {groupPlay === "swiss" ? "Rounds" : "Games per team"}
                </h4>
                <p className="text-[10px]">
                  {groupPlay === "swiss"
                    ? "Each round pairs teams with similar records."
                    : "Everyone plays the same number of group games."}
                </p>
              </div>
              <input
                type="number"
                value={groupGames}
                onChange={(e) => setGroupGames(e.target.value)}
                className="p-1 border rounded-md border-primary h-[40px] w-[60px] text-center"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Playoff Bracket</h4>
              <p className="text-[10px]">
                Any size works — byes go to the top seeds.
              </p>
            </div>
            <select
              value={playoffTake}
              onChange={(e) => setPlayoffTake(e.target.value)}
              className="p-2 border rounded-md border-primary bg-white"
            >
              <option value="none">No playoffs</option>
              <option value="2">Top 2 (finals)</option>
              <option value="4">Top 4</option>
              <option value="6">Top 6</option>
              <option value="8">Top 8</option>
              <option value="all">All teams</option>
            </select>
          </div>
        </div>
      )}

      <button className="tertiary-btn" onClick={addClicked}>
        Add {eventText[selectedType] || ""}
      </button>
    </div>
  );
};

export default CreateEvent;
