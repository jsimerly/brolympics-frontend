import { useState } from "react";
import CreateLeaguePage from "./CreateLeaguePage.jsx";
import CreateBrolympics from "./CreateBrolympics.jsx";
import AddEvent from "./AddEvent.jsx";
import AddPlayers from "./AddPlayers.jsx";
import ReviewStep from "./ReviewStep.jsx";
import { createLeagueWithBro } from "../../api/client/wizard";
import { useNotification } from "../Util/Notification.jsx";
import { apiErrorMessage } from "../Util/apiError";

const StepManager = ({ step, nextStep, prevStep, sx = "" }) => {
  const [league, setLeague] = useState({});
  const [brolympics, setBrolympics] = useState({});
  const [h2hEvents, setH2hEvents] = useState([]);
  const [indEvents, setIndEvents] = useState([]);
  const [teamEvents, setTeamEvents] = useState([]);
  const [ffaEvents, setFfaEvents] = useState([]);
  const [link, setLink] = useState();
  const [creating, setCreating] = useState(false);
  const { showNotification } = useNotification();

  const createAll = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const events = [
        ...h2hEvents.map((e) => ({ ...e, format: "h2h" })),
        ...indEvents.map((e) => ({ ...e, format: "ind" })),
        ...teamEvents.map((e) => ({ ...e, format: "team" })),
        ...ffaEvents.map((e) => ({ ...e, format: "ffa" })),
      ];
      // all-or-nothing: a failure anywhere rolls back the league AND bro,
      // so "try again" can't stack duplicates (the ghost-bro lesson)
      const { bro, warnings } = await createLeagueWithBro(
        league,
        brolympics,
        events
      );
      if (warnings.length) {
        showNotification(warnings.join(" — "), "warning");
      }
      setLink(bro.uuid);
      nextStep();
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "There was an error creating your league. Please try again.")
      );
    } finally {
      setCreating(false);
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
        totalSteps={5}
        nextStep={nextStep}
        setBrolympics={setBrolympics}
      />
      <AddEvent
        step={3}
        totalSteps={5}
        back={prevStep}
        h2hEvents={h2hEvents}
        indEvents={indEvents}
        teamEvents={teamEvents}
        ffaEvents={ffaEvents}
        setH2hEvents={setH2hEvents}
        setIndEvents={setIndEvents}
        setTeamEvents={setTeamEvents}
        setFfaEvents={setFfaEvents}
        createAll={nextStep}
        setLink={setLink}
      />
      <ReviewStep
        step={4}
        totalSteps={5}
        back={prevStep}
        leagueName={league?.name}
        brolympics={brolympics}
        h2hEvents={h2hEvents}
        indEvents={indEvents}
        teamEvents={teamEvents}
        ffaEvents={ffaEvents}
        onCreate={createAll}
        creating={creating}
      />
      <AddPlayers
        step={5}
        totalSteps={5}
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
