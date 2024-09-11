import { useState, useEffect } from "react";
import CreateWrapper from "./CreateWrapper";
import CreateEventManger from "./events/CreateEventManger";
import RemoveIcon from "@mui/icons-material/Remove";

const EventComp = ({ header, events, setter }) => {
  const removeEvent = (i, events, setter) => {
    const newEvents = [...events];
    newEvents.splice(i, 1);
    setter(newEvents);
  };

  return (
    <>
      <h4 className="font-semibold">{header}</h4>
      <ul>
        {events.map((event, i) => (
          <li key={i} className="flex">
            <button onClick={() => removeEvent(i, events, setter)}>
              <RemoveIcon className="mr-1 text-errorRed" />
            </button>
            <p>{event.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

const AddEvent = ({
  step,
  h2hEvents,
  indEvents,
  teamEvents,
  setH2hEvents,
  setIndEvents,
  setTeamEvents,
  createAll,
  setLink,
}) => {
  const handleCreateClicked = () => {
    createAll();
  };
  const [buttonText, setButtonText] = useState("Skip");
  const [isEventAdded, setIsEventAdded] = useState(false);

  useEffect(() => {
    const totalEvents = h2hEvents.length + indEvents.length + teamEvents.length;
    const isEventAddedLocal = totalEvents !== 0;
    const buttonTextLocal = isEventAddedLocal
      ? `Create ${totalEvents} Events`
      : "Skip";

    setButtonText(buttonTextLocal);
    setIsEventAdded(isEventAddedLocal);
  }, [h2hEvents, indEvents, teamEvents]);

  return (
    <CreateWrapper
      color="tertiary"
      button_text={buttonText}
      grey_out={!isEventAdded}
      step={step}
      submit={handleCreateClicked}
      title={"Add Events to Your Brolympics"}
      description={
        "Add Events to your Brolympics. These are the events that will make up the entire competition."
      }
    >
      <CreateEventManger
        setH2hEvents={setH2hEvents}
        setIndEvents={setIndEvents}
        setTeamEvents={setTeamEvents}
      />
      <div>
        <h3 className="pt-6 text-[18px] font-bold">Your Events</h3>
        {indEvents.length > 0 && (
          <EventComp
            header="Individual Events"
            events={indEvents}
            setter={setIndEvents}
          />
        )}
        {h2hEvents.length > 0 && (
          <EventComp
            header="Head to Head Events"
            events={h2hEvents}
            setter={setH2hEvents}
          />
        )}
        {teamEvents.length > 0 && (
          <EventComp
            header="Team Events"
            events={teamEvents}
            setter={setTeamEvents}
          />
        )}
      </div>
    </CreateWrapper>
  );
};

export default AddEvent;
