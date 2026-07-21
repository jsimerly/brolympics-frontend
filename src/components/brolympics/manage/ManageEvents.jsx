import { useState } from "react";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { createEvent, defaultStagesFor } from "../../../api/client";
import ManageEvent from "./events/ManageEvent.jsx";
import CreateEvent from "../../create_league_page/events/CreateEvent.jsx";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

const ManageEvents = ({ events, teams }) => {
  const [addingEvent, setAddingEvent] = useState(false);
  const [compEvents, setCompEvents] = useState(events || []);
  const { uuid } = useParams();
  const { showNotification } = useNotification();

  const handleEventAdd = async (eventName, type, stages, extras = {}) => {
    try {
      const created = await createEvent({
        brolympics: uuid,
        event_type_name: eventName,
        format: type,
        stages: stages || defaultStagesFor(type),
        ...extras,
      });
      setCompEvents((prev) => [
        ...prev,
        { ...created, type: created.format || type },
      ]);
      setAddingEvent(false);
      if (created.warnings?.length) {
        showNotification(created.warnings.join(" "), "border-yellow-500");
      }
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "There was an error creating this event.")
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {compEvents.length === 0 && (
        <p className="text-sm text-light">No events yet — add the first one.</p>
      )}
      {compEvents.map((event) => (
        <ManageEvent event={event} teams={teams} key={event.uuid} />
      ))}

      <button
        className={`flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-semibold rounded-full ${
          addingEvent
            ? "text-light bg-gray-100"
            : "text-white bg-primary"
        }`}
        onClick={() => setAddingEvent((v) => !v)}
      >
        {addingEvent ? (
          <>
            <CloseIcon sx={{ fontSize: 18 }} /> Close
          </>
        ) : (
          <>
            <AddCircleOutlineIcon sx={{ fontSize: 18 }} /> Add Event
          </>
        )}
      </button>
      {addingEvent && <CreateEvent handleEventAdded={handleEventAdd} />}
    </div>
  );
};

export default ManageEvents;
