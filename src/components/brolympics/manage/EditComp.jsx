import { useEffect, useState, useCallback } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchBrolympicsEvents, fetchContests } from "../../../api/client";
import { useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";
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

const EditComp = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      showNotification("Unable to connect to get your competition data.");
    } finally {
      setIsLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    getComps();
  }, [getComps]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-semibold">Loading competition data...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold">Edit Competitions</h2>
      <ul>
        {events.map((event) => (
          <div key={event.uuid}>
            <ClickCard title={event.name}>
              <ul className="space-y-2">
                {event.contests.map((contest) => (
                  <ContestEditCard
                    contest={contest}
                    onSaved={getComps}
                    key={contest.uuid}
                  />
                ))}
                {event.contests.length === 0 &&
                  "This event has not been started yet."}
              </ul>
            </ClickCard>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default EditComp;
