import { useState } from "react";

import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import { buildStages as buildStageList } from "../../Util/stageBuilder";

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
  const [groupPlay, setGroupPlay] = useState("semi");
  const [groupGames, setGroupGames] = useState("4");
  const [playoffTake, setPlayoffTake] = useState("4");
  const [runoffs, setRunoffs] = useState("third");
  const [placeThrough, setPlaceThrough] = useState("");
  const [heatSize, setHeatSize] = useState("");
  const [outingGames, setOutingGames] = useState("1");

  const buildStages = () =>
    buildStageList({
      format: selectedType,
      groupPlay,
      nMatches: groupGames,
      hasPlayoffs: playoffTake !== "none",
      take: playoffTake !== "all" && playoffTake !== "none" ? playoffTake : "",
      runoffs,
      placeThrough,
      heatSize,
      outingGames,
    });

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

      {(selectedType === "ind" || selectedType === "team") && (
        <div className="flex flex-col gap-3">
          <span className="form-label">Structure</span>
          <SelectRow
            label="Games per team"
            hint="How many rounds each team plays — bowling classically runs 2."
          >
            <input
              type="number"
              value={outingGames}
              onChange={(e) => setOutingGames(e.target.value)}
              className="w-16 shrink-0 input-box"
            />
          </SelectRow>
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
              className="w-16 shrink-0 input-box"
            />
          </SelectRow>
        </div>
      )}

      {selectedType === "h2h" && (
        <div className="flex flex-col gap-3">
          <span className="form-label">Structure</span>
          <div>
            <h4 className="text-sm font-semibold">Group Play</h4>
            <p className="text-[10px] text-light">
              Round robin schedules every matchup up front — ideal for events
              played out over weeks. Swiss pairs each round as the last one
              finishes.
            </p>
            <div className="flex overflow-hidden mt-1.5 text-xs font-semibold border border-gray-300 rounded-full w-fit">
              {[
                ["none", "None"],
                ["semi", "Semi-RR"],
                ["full", "Full-RR"],
                [
                  "swiss",
                  <span
                    className="flex items-center gap-0.5"
                    key="swiss-label"
                  >
                    Swiss
                    <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                  </span>,
                ],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`px-3 py-1.5 ${
                    groupPlay === key
                      ? "bg-primary text-white"
                      : "bg-white text-light"
                  }`}
                  onClick={() => setGroupPlay(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {(groupPlay === "semi" || groupPlay === "swiss") && (
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
                className="w-16 shrink-0 input-box"
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
              className="shrink-0 input-box"
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
            <div>
              <h4 className="text-sm font-semibold">Run-off games</h4>
              <p className="text-[10px] text-light">
                {runoffs === "off"
                  ? "Winners only — the semifinal losers tie for 3rd and split the points."
                  : runoffs === "third"
                  ? "The semifinal losers play for bronze."
                  : runoffs === "every"
                  ? "Run-off brackets settle every place — 5th/6th, 7th/8th and beyond."
                  : "Run-offs settle places down to a depth you pick; deeper places tie in pairs and split the points."}
              </p>
              <div className="flex overflow-hidden mt-1.5 text-xs font-semibold border border-gray-300 rounded-full w-fit">
                {[
                  ["off", "Off"],
                  ["third", "3rd place"],
                  [
                    "every",
                    <span
                      className="flex items-center gap-0.5"
                      key="every-label"
                    >
                      Every
                      <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                    </span>,
                  ],
                  [
                    "custom",
                    <span
                      className="flex items-center gap-0.5"
                      key="custom-label"
                    >
                      Custom
                      <DiamondOutlinedIcon sx={{ fontSize: 12 }} />
                    </span>,
                  ],
                ].map(([value, label]) => (
                  <button
                    key={String(value)}
                    className={`px-3 py-1.5 ${
                      runoffs === value
                        ? "bg-primary text-white"
                        : "bg-white text-light"
                    }`}
                    onClick={() => setRunoffs(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {runoffs === "custom" &&
                (Number(playoffTake) >= 6 ? (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-light">
                      Play places through
                    </span>
                    <select
                      value={placeThrough || Number(playoffTake) - 2}
                      onChange={(e) => setPlaceThrough(e.target.value)}
                      className="input-box !py-1"
                    >
                      {Array.from(
                        {
                          length:
                            Math.floor((Number(playoffTake) - 2) / 2) - 1,
                        },
                        (_, i) => 4 + i * 2
                      ).map((place) => (
                        <option key={place} value={place}>
                          {place}th
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-light">
                    Custom depth needs a bracket of 6+ — pick Top 6 or Top 8
                    above.
                  </p>
                ))}
            </div>
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
