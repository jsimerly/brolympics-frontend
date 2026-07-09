import { useEffect, useState, useCallback } from "react";
import { fetchBrolympicsEvents, fetchEventBracket } from "../../../api/client";
import { useParams } from "react-router-dom";
import ContestEditCard from "./ContestEditCard";
import { EventFold } from "./EditComp";

const EditBracket = () => {
  const { uuid } = useParams();
  const [events, setEvents] = useState([]);

  const getEvents = useCallback(async () => {
    try {
      const eventList = await fetchBrolympicsEvents(uuid);
      const withKnockout = eventList.filter((e) =>
        (e.stages || []).some((s) => s.structure === "knockout")
      );
      const brackets = await Promise.all(
        withKnockout.map((e) => fetchEventBracket(e.uuid).catch(() => []))
      );
      setEvents(
        withKnockout.map((event, i) => ({ ...event, brackets: brackets[i] }))
      );
    } catch (error) {
      console.log(error);
    }
  }, [uuid]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-light">
        Playoff games round by round. Fixing an earlier round rolls the
        advanced team back — locked once the next round has been played.
      </p>
      {events.map((event) => (
        <EventFold title={event.name} key={event.uuid}>
          <div className="space-y-2">
            {event.brackets.flatMap((bracket) => {
              const rounds = [
                ...new Set(bracket.nodes.map((n) => n.round)),
              ].sort((a, b) => a - b);
              return rounds.map((round) => (
                <div key={`${bracket.stage}_${round}`} className="space-y-2">
                  <h3 className="text-xs font-semibold tracking-wide uppercase text-light">
                    {round === rounds[rounds.length - 1]
                      ? "Finals"
                      : `Round ${round}`}
                  </h3>
                  {bracket.nodes
                    .filter((n) => n.round === round)
                    .map((node) => (
                      <ContestEditCard
                        contest={node.contest}
                        onSaved={getEvents}
                        key={`${node.round}_${node.slot}`}
                      />
                    ))}
                </div>
              ));
            })}
            {event.brackets.every((b) => b.nodes.length === 0) && (
              <p className="text-xs text-light">
                The bracket hasn't been generated yet.
              </p>
            )}
          </div>
        </EventFold>
      ))}
      {events.length === 0 && (
        <p className="text-sm text-light">
          No events with a bracket stage in this Brolympics.
        </p>
      )}
    </div>
  );
};

export default EditBracket;
