import { useNotification } from "../../Util/Notification";
import CreateEvent from "./CreateEvent";

const CreateEventManger = ({
  setH2hEvents,
  setIndEvents,
  setTeamEvents,
  setFfaEvents,
}) => {
  const { showNotification } = useNotification();

  const handleEventAdded = (eventName, selectedType, stages, extra = {}) => {
    if (!eventName) {
      showNotification("You must enter an event name.");
      return;
    }
    const newEvent = { name: eventName.trim(), stages, ...extra };
    const setters = {
      ind: setIndEvents,
      h2h: setH2hEvents,
      team: setTeamEvents,
      ffa: setFfaEvents,
    };
    setters[selectedType]?.((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="w-full">
      <CreateEvent handleEventAdded={handleEventAdded} />
    </div>
  );
};

export default CreateEventManger;
