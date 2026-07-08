import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState, useCallback } from "react";
import { fetchBrolympicsEvents, fetchEventBracket } from "../../../api/client";
import { useParams } from "react-router-dom";
import ContestEditCard from "./ContestEditCard";

const ClickCard = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div className="w-full py-3">
      <div onClick={handleToggle} className="flex justify-between pb-3">
        <h3 className="font-semibold text-[18px]">{title}</h3>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>

      {isOpen && children}
    </div>
  );
};

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
    <div>
      Brackets
      <div>
        {events.map((event) => (
          <ClickCard title={event.name} key={event.uuid}>
            <div className="space-y-2">
              {event.brackets.flatMap((bracket) => {
                const rounds = [
                  ...new Set(bracket.nodes.map((n) => n.round)),
                ].sort((a, b) => a - b);
                return rounds.map((round) => (
                  <div key={`${bracket.stage}_${round}`} className="space-y-2">
                    <h2 className="font-semibold">
                      {round === rounds[rounds.length - 1]
                        ? "Finals"
                        : `Round ${round}`}
                    </h2>
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
              {event.brackets.every((b) => b.nodes.length === 0) &&
                "The bracket has not been generated yet."}
            </div>
          </ClickCard>
        ))}
        {events.length === 0 && (
          <p className="text-[12px] pt-2">
            No events with a bracket stage in this Brolympics.
          </p>
        )}
      </div>
    </div>
  );
};

export default EditBracket;
