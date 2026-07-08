import { useState } from "react";
import CreateWrapper from "./CreateWrapper";
import CreateEventManger from "./events/CreateEventManger";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import HistoryIcon from "@mui/icons-material/History";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { fetchEventTypes } from "../../api/client";
import useCachedFetch from "../../hooks/useCachedFetch";

const FORMAT_LABEL = { h2h: "Head to Head", ind: "Individual", team: "Team", ffa: "Free-for-All" };

const EventComp = ({ header, events, setter }) => {
  const removeEvent = (i) => {
    const next = [...events];
    next.splice(i, 1);
    setter(next);
  };

  return (
    <>
      <h4 className="pt-2 text-xs font-semibold tracking-wide uppercase text-light">
        {header}
      </h4>
      <ul>
        {events.map((event, i) => (
          <li key={i} className="flex items-center py-0.5">
            <button onClick={() => removeEvent(i)}>
              <RemoveIcon className="mr-1 text-red" sx={{ fontSize: 18 }} />
            </button>
            <p>{event.name}</p>
            {event.fromLineage && (
              <span className="ml-2 text-[10px] text-light">
                same settings as {event.lastPlayed}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

const AddEvent = ({
  step,
  totalSteps,
  leagueUuid,
  h2hEvents,
  indEvents,
  teamEvents,
  ffaEvents = [],
  setH2hEvents,
  setIndEvents,
  setTeamEvents,
  setFfaEvents,
  createAll,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const { data: eventTypes } = useCachedFetch(
    leagueUuid ? `event-types:${leagueUuid}` : null,
    () => fetchEventTypes(leagueUuid)
  );

  const setters = {
    h2h: setH2hEvents,
    ind: setIndEvents,
    team: setTeamEvents,
    ffa: setFfaEvents,
  };
  const lists = { h2h: h2hEvents, ind: indEvents, team: teamEvents, ffa: ffaEvents };
  const totalEvents =
    h2hEvents.length + indEvents.length + teamEvents.length + ffaEvents.length;

  const isAdded = (name, format) =>
    (lists[format] || []).some((e) => e.name === name);

  const toggleRecommended = (row) => {
    const setter = setters[row.format];
    if (!setter) return;
    if (isAdded(row.name, row.format)) {
      setter((prev) => prev.filter((e) => e.name !== row.name));
      return;
    }
    setter((prev) => [
      ...prev,
      {
        name: row.name,
        stages: row.latest?.stages?.length ? row.latest.stages : undefined,
        is_high_score_wins: row.latest?.is_high_score_wins,
        location: row.latest?.location,
        rules: row.latest?.rules,
        config: row.latest?.config,
        fromLineage: true,
        lastPlayed: row.last_played,
      },
    ]);
  };

  const recommended = (eventTypes || []).filter((row) => row.latest);

  return (
    <CreateWrapper
      button_text={totalEvents > 0 ? `Create ${totalEvents} Events` : "Skip for now"}
      step={step}
      totalSteps={totalSteps}
      submit={createAll}
      title="Add Events"
      description="These are the events that make up the competition. You can reshape any of them later."
    >
      <div className="flex flex-col gap-4 py-2">
        {recommended.length > 0 && (
          <div>
            <h3 className="flex items-center gap-1 pb-2 text-xs font-semibold tracking-wide uppercase text-light">
              <HistoryIcon sx={{ fontSize: 14 }} /> Your league's events
            </h3>
            <div className="space-y-2">
              {recommended.map((row) => {
                const added = isAdded(row.name, row.format);
                return (
                  <button
                    key={row.uuid}
                    onClick={() => toggleRecommended(row)}
                    className={`flex items-center w-full gap-3 p-3 text-left transition-colors border rounded-lg ${
                      added
                        ? "border-primary bg-primary/5"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col flex-grow min-w-0">
                      <span className="font-semibold leading-tight">
                        {row.name}
                      </span>
                      <span className="text-xs text-light">
                        {FORMAT_LABEL[row.format] || row.format} · played ×
                        {row.times_played} · last {row.last_played}
                      </span>
                    </div>
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        added
                          ? "text-white bg-primary"
                          : "border text-light border-gray-300"
                      }`}
                    >
                      {added ? (
                        <CheckIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <AddIcon sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="pt-1 text-[11px] text-light">
              One tap re-adds it with the same settings as last time.
            </p>
          </div>
        )}

        <button
          className="flex items-center justify-between w-full p-3 font-semibold bg-white border border-gray-200 rounded-lg"
          onClick={() => setShowCustom((s) => !s)}
        >
          <span className="flex items-center gap-2">
            <AddIcon sx={{ fontSize: 18 }} className="text-primary" />
            {recommended.length > 0 ? "Add a new event" : "Add an event"}
          </span>
          {showCustom ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
        {showCustom && (
          <CreateEventManger
            setH2hEvents={setH2hEvents}
            setIndEvents={setIndEvents}
            setTeamEvents={setTeamEvents}
            setFfaEvents={setFfaEvents}
          />
        )}

        {totalEvents > 0 && (
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold">This year's lineup ({totalEvents})</h3>
            {h2hEvents.length > 0 && (
              <EventComp header="Head to Head" events={h2hEvents} setter={setH2hEvents} />
            )}
            {indEvents.length > 0 && (
              <EventComp header="Individual" events={indEvents} setter={setIndEvents} />
            )}
            {teamEvents.length > 0 && (
              <EventComp header="Team" events={teamEvents} setter={setTeamEvents} />
            )}
            {ffaEvents.length > 0 && (
              <EventComp header="Free-for-All" events={ffaEvents} setter={setFfaEvents} />
            )}
          </div>
        )}
      </div>
    </CreateWrapper>
  );
};

export default AddEvent;
