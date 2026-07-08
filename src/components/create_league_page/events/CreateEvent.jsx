import { useState } from "react";

import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";

const FORMATS = [
  {
    type: "h2h",
    label: "Head to Head",
    hint: "Teams face off",
    Icon: SportsKabaddiIcon,
  },
  {
    type: "ind",
    label: "Individual",
    hint: "Everyone scores solo",
    Icon: PersonIcon,
  },
  {
    type: "team",
    label: "Team",
    hint: "One score per team",
    Icon: GroupsIcon,
  },
  {
    type: "ffa",
    label: "Free-for-All",
    hint: "Heats and placements",
    Icon: SportsMotorsportsIcon,
  },
];

const SelectRow = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <h4 className="text-sm font-semibold">{label}</h4>
      <p className="text-[10px] text-light">{hint}</p>
    </div>
    {children}
  </div>
);

const CreateEvent = ({ handleEventAdded }) => {
  const [selectedType, setSelectedType] = useState("h2h");
  const [eventName, setEventName] = useState("");
  const [highWins, setHighWins] = useState(true);
  const [groupPlay, setGroupPlay] = useState("round_robin");
  const [groupGames, setGroupGames] = useState("4");
  const [playoffTake, setPlayoffTake] = useState("4");
  const [placements, setPlacements] = useState("third");
  const [heatSize, setHeatSize] = useState("");

  const buildStages = () => {
    if (selectedType === "ffa") {
      const size = Number(heatSize);
      return [
        {
          structure: "heats",
          config: size >= 2 ? { heat_size: size } : {},
        },
      ];
    }
    if (selectedType !== "h2h") return [{ structure: "open_play", config: {} }];

    const stages = [];
    const n = Number(groupGames) || 4;
    if (groupPlay === "round_robin") {
      stages.push({ structure: "round_robin", config: { games_per_team: n } });
    } else if (groupPlay === "swiss") {
      stages.push({ structure: "swiss", config: { rounds: n } });
    }
    if (playoffTake !== "none" || stages.length === 0) {
      const config = { byes: "seeded" };
      if (placements === "third") config.third_place = true;
      if (placements === "full" || placements === "full-skip-last") {
        config.classification = true;
      }
      if (placements === "full-skip-last") {
        const take =
          playoffTake !== "all" && playoffTake !== "none"
            ? Number(playoffTake)
            : null;
        if (take && take >= 4) config.unplayed_places = [take - 1];
      }
      if (playoffTake !== "all" && playoffTake !== "none") {
        config.take = Number(playoffTake);
      }
      stages.push({ structure: "knockout", config });
    }
    return stages;
  };

  const addClicked = () => {
    handleEventAdded(eventName, selectedType, buildStages(), {
      is_high_score_wins: highWins,
    });
    setEventName("");
  };

  return (
    <div className="flex flex-col w-full gap-4 p-3 bg-white border border-gray-200 rounded-lg">
      <div>
        <label htmlFor="custom-event-name" className="form-label">
          Event name <span className="text-red">*</span>
        </label>
        <input
          id="custom-event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Backyard Biathlon"
          autoComplete="off"
          className="w-full input-primary"
        />
      </div>

      <div>
        <span className="form-label">Format</span>
        <div className="grid grid-cols-2 gap-1.5">
          {FORMATS.map(({ type, label, hint, Icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-2 px-2.5 py-2 text-left transition-colors border rounded-lg ${
                selectedType === type
                  ? "border-primary bg-primary/5"
                  : "bg-white border-gray-200"
              }`}
            >
              <Icon
                sx={{ fontSize: 22 }}
                className={selectedType === type ? "text-primary" : "text-light"}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium leading-tight">
                  {label}
                </span>
                <span className="text-[10px] text-light">{hint}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedType !== "ffa" && (
        <div>
          <span className="form-label">Scoring</span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              [true, "High score wins", "Points, makes, distance"],
              [false, "Low score wins", "Golf strokes, race times"],
            ].map(([value, label, hint]) => (
              <button
                key={String(value)}
                onClick={() => setHighWins(value)}
                className={`px-2.5 py-2 text-left transition-colors border rounded-lg ${
                  highWins === value
                    ? "border-primary bg-primary/5"
                    : "bg-white border-gray-200"
                }`}
              >
                <span className="block text-sm font-medium leading-tight">
                  {label}
                </span>
                <span className="text-[10px] text-light">{hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedType === "ffa" && (
        <div className="flex flex-col gap-3">
          <span className="form-label">Heats</span>
          <SelectRow
            label="Heat size"
            hint="Set it to pre-build balanced heats at start (16 racers in 8s = 8/8). Leave blank to make heats at the party."
          >
            <input
              type="number"
              value={heatSize}
              onChange={(e) => setHeatSize(e.target.value)}
              placeholder="—"
              className="w-16 p-2 text-center bg-white border border-gray-300 rounded-md shrink-0"
            />
          </SelectRow>
        </div>
      )}

      {selectedType === "h2h" && (
        <div className="flex flex-col gap-3">
          <span className="form-label">Structure</span>
          <SelectRow
            label="Group Play"
            hint="Round robin schedules every matchup up front — ideal for events played out over weeks. Swiss pairs each round as the last one finishes."
          >
            <select
              value={groupPlay}
              onChange={(e) => setGroupPlay(e.target.value)}
              className="p-2 bg-white border border-gray-300 rounded-md shrink-0"
            >
              <option value="round_robin">Round Robin</option>
              <option value="swiss">Swiss</option>
              <option value="none">None (bracket only)</option>
            </select>
          </SelectRow>
          {groupPlay !== "none" && (
            <SelectRow
              label={groupPlay === "swiss" ? "Rounds" : "Games per team"}
              hint={
                groupPlay === "swiss"
                  ? "Each round pairs similar records."
                  : "Everyone plays the same number."
              }
            >
              <input
                type="number"
                value={groupGames}
                onChange={(e) => setGroupGames(e.target.value)}
                className="w-16 p-2 text-center bg-white border border-gray-300 rounded-md shrink-0"
              />
            </SelectRow>
          )}
          <SelectRow
            label="Playoff Bracket"
            hint="Any size works — byes go to top seeds."
          >
            <select
              value={playoffTake}
              onChange={(e) => setPlayoffTake(e.target.value)}
              className="p-2 bg-white border border-gray-300 rounded-md shrink-0"
            >
              <option value="none">No playoffs</option>
              <option value="2">Top 2</option>
              <option value="4">Top 4</option>
              <option value="6">Top 6</option>
              <option value="8">Top 8</option>
              <option value="all">All teams</option>
            </select>
          </SelectRow>
          {playoffTake !== "none" && (
            <SelectRow
              label="Placement Games"
              hint="Full placement runs 5th/6th, 7th/8th run-offs."
            >
              <select
                value={placements}
                onChange={(e) => setPlacements(e.target.value)}
                className="p-2 bg-white border border-gray-300 rounded-md shrink-0"
              >
                <option value="third">3rd place game</option>
                <option value="full">Full placement</option>
                <option value="full-skip-last">Full, split last</option>
                <option value="none">Winners only</option>
              </select>
            </SelectRow>
          )}
        </div>
      )}

      <button
        className={`w-full py-2.5 font-semibold rounded-full transition-colors ${
          eventName.trim()
            ? "text-white bg-primary"
            : "text-gray-400 bg-gray-100 cursor-not-allowed"
        }`}
        onClick={eventName.trim() ? addClicked : undefined}
        disabled={!eventName.trim()}
      >
        Add {eventName.trim() || "event"}
      </button>
    </div>
  );
};

export default CreateEvent;
