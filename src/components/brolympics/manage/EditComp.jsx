import { useEffect, useState, useCallback } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchBrolympicsEvents, fetchContests } from "../../../api/client";
import { useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";
import ContestEditCard from "./ContestEditCard";
import { SkeletonPage } from "../../Util/Skeleton";

export const EventFold = ({ title, count, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <button
        className="flex items-center justify-between w-full gap-2 p-3 text-left"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="flex items-center min-w-0 gap-2">
          <span className="font-semibold truncate">{title}</span>
          {count != null && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 bg-gray-100 text-light">
              {count}
            </span>
          )}
        </span>
        {isOpen ? (
          <ExpandLessIcon className="shrink-0 text-light" />
        ) : (
          <ExpandMoreIcon className="shrink-0 text-light" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

const EditComp = () => {
  const [events, setEvents] = useState(null);
  const { uuid } = useParams();
  const { showNotification } = useNotification();

  const getComps = useCallback(async () => {
    try {
      const [eventList, contests] = await Promise.all([
        fetchBrolympicsEvents(uuid),
        fetchContests({ brolympics: uuid }),
      ]);
      setEvents(
        eventList.map((event) => ({
          ...event,
          contests: contests.filter((c) => c.event === event.uuid),
        }))
      );
    } catch (error) {
      showNotification("Unable to load your competition data.");
      setEvents([]);
    }
  }, [uuid]);

  useEffect(() => {
    getComps();
  }, [getComps]);

  if (events === null) {
    return <SkeletonPage rows={5} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-light">
        Fixes re-record the game — brackets and standings update automatically.
        Locked once a later round consumed the result.
      </p>
      {events.map((event) => (
        <EventFold
          title={event.name}
          count={event.contests.length}
          key={event.uuid}
        >
          <div className="space-y-2">
            {event.contests.map((contest) => (
              <ContestEditCard
                contest={contest}
                onSaved={getComps}
                key={contest.uuid}
              />
            ))}
            {event.contests.length === 0 && (
              <p className="text-xs text-light">
                This event hasn't started yet.
              </p>
            )}
          </div>
        </EventFold>
      ))}
    </div>
  );
};

export default EditComp;
