import { useState } from "react";
import CreateLeaguePage from "./CreateLeaguePage.jsx";
import CreateBrolympics from "./CreateBrolympics.jsx";
import AddEvent from "./AddEvent.jsx";
import AddPlayers from "./AddPlayers.jsx";
import {
  createLeague,
  createBrolympics,
  createEvent,
  defaultStagesFor,
} from "../../api/client";
import { useNotification } from "../Util/Notification.jsx";

const StepManager = ({ step, nextStep, prevStep, sx = "" }) => {
  const [league, setLeague] = useState({});
  const [brolympics, setBrolympics] = useState({});
  const [h2hEvents, setH2hEvents] = useState([]);
  const [indEvents, setIndEvents] = useState([]);
  const [teamEvents, setTeamEvents] = useState([]);
  const [ffaEvents, setFfaEvents] = useState([]);
  const [link, setLink] = useState();
  const { showNotification } = useNotification();

  const createAll = async () => {
    try {
      const newLeague = await createLeague(league);
      const newBro = await createBrolympics({
        ...brolympics,
        league: newLeague.uuid,
      });
      const events = [
        ...h2hEvents.map((e) => ({ ...e, format: "h2h" })),
        ...indEvents.map((e) => ({ ...e, format: "ind" })),
        ...teamEvents.map((e) => ({ ...e, format: "team" })),
        ...ffaEvents.map((e) => ({ ...e, format: "ffa" })),
      ];
      const warnings = [];
      for (const event of events) {
        const created = await createEvent({
          brolympics: newBro.uuid,
          event_type_name: event.name,
          format: event.format,
          stages: event.stages || defaultStagesFor(event.format),
          ...(event.event_type && { event_type: event.event_type }),
          ...(event.is_high_score_wins != null && {
            is_high_score_wins: event.is_high_score_wins,
          }),
          ...(event.location && { location: event.location }),
          ...(event.rules && { rules: event.rules }),
          ...(event.config && { config: event.config }),
        });
        if (created.warnings?.length) {
          warnings.push(`${event.name}: ${created.warnings.join(" ")}`);
        }
      }
      if (warnings.length) {
        showNotification(warnings.join(" — "), "border-yellow-500");
      }
      setLink(newBro.uuid);
      nextStep();
    } catch (error) {
      showNotification(
        "There was an error while trying to create your league. Please check back shortly."
      );
    }
  };
  return (
    <div
      className={`transition ease-in-out duration-200 flex
            w-full bg-gray-100
        `}
      style={{ transform: `translateX(-${100 * (step - 1)}%` }}
    >
      <CreateLeaguePage step={1} nextStep={nextStep} setLeague={setLeague} />
      <CreateBrolympics
        step={2}
        totalSteps={4}
        nextStep={nextStep}
        setBrolympics={setBrolympics}
      />
      <AddEvent
        step={3}
        totalSteps={4}
        h2hEvents={h2hEvents}
        indEvents={indEvents}
        teamEvents={teamEvents}
        ffaEvents={ffaEvents}
        setH2hEvents={setH2hEvents}
        setIndEvents={setIndEvents}
        setTeamEvents={setTeamEvents}
        setFfaEvents={setFfaEvents}
        createAll={createAll}
        setLink={setLink}
      />
      <AddPlayers
        step={4}
        totalSteps={4}
        link={link}
        broName={brolympics?.name}
        onComplete={() => {
          window.location.href = `/b/${link}/home`;
        }}
      />
    </div>
  );
};

export default StepManager;
