import CreateBrolympics from "../../create_league_page/CreateBrolympics";
import AddEvent from "../../create_league_page/AddEvent";
import ReviewStep from "../../create_league_page/ReviewStep";
import AddPlayers from "../../create_league_page/AddPlayers";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";
import { createBroWithEvents } from "../../../api/client/wizard";
import { fetchLeague } from "../../../api/client";
import useCachedFetch from "../../../hooks/useCachedFetch";
import usePersistentState, {
  clearPersistentState,
} from "../../../hooks/usePersistentState";
import { apiErrorMessage } from "../../Util/apiError";

const CreateBrolympicsManager = () => {
  const { uuid } = useParams();
  // the league's structure locks the wizard's type step (one structure per
  // league, ruled 2026-07-22)
  const { data: league } = useCachedFetch(`league:${uuid}`, () =>
    fetchLeague(uuid)
  );
  const K = (name) => `wizard:bro:${uuid}:${name}`;
  const [step, setStep] = usePersistentState(K("step"), 1);
  const [brolympics, setBrolympics] = usePersistentState(K("bro"), {});
  const [h2hEvents, setH2hEvents] = usePersistentState(K("h2h"), []);
  const [indEvents, setIndEvents] = usePersistentState(K("ind"), []);
  const [teamEvents, setTeamEvents] = usePersistentState(K("team"), []);
  const [ffaEvents, setFfaEvents] = usePersistentState(K("ffa"), []);
  const [link, setLink] = usePersistentState(K("link"), null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const clearWizard = () =>
    clearPersistentState(
      ...["step", "bro", "h2h", "ind", "team", "ffa", "form", "link"].map(K)
    );
  const finish = () => {
    const destination = link;
    clearWizard();
    navigate(`/b/${destination}/home`);
  };

  const [creating, setCreating] = useState(false);
  const nextStep = () => {
    if (step < 4) {
      setStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step) => step - 1);
    }
  };

  const createBrolympics = async () => {
    if (creating) return;
    setCreating(true);
    try {
      // all-or-nothing: a mid-list event failure rolls the new bro back, so
      // trying again can't leave half-built Brolympics behind
      const { bro, warnings } = await createBroWithEvents(
        { ...brolympics, league: uuid },
        [
          ...h2hEvents.map((e) => ({ ...e, format: "h2h" })),
          ...indEvents.map((e) => ({ ...e, format: "ind" })),
          ...teamEvents.map((e) => ({ ...e, format: "team" })),
          ...ffaEvents.map((e) => ({ ...e, format: "ffa" })),
        ]
      );
      if (warnings.length) {
        showNotification(warnings.join(" — "), "warning");
      }
      setLink(bro.uuid);
      nextStep();
    } catch (error) {
      console.log(error);
      showNotification(
        apiErrorMessage(
          error,
          "There was an error creating your Brolympics. Nothing was saved, so it's safe to try again."
        )
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-[calc(100vh-60px)] overflow-x-hidden">
      <div
        className={`transition ease-in-out duration-200 flex
            w-full`}
        style={{ transform: `translateX(-${100 * (step - 1)}%` }}
      >
        <CreateBrolympics
          step={1}
          totalSteps={4}
          nextStep={nextStep}
          setBrolympics={setBrolympics}
          storageKey={K("form")}
          lockedTeamSize={league?.team_size ?? null}
        />
        <AddEvent
          step={2}
          totalSteps={4}
          back={prevStep}
          leagueUuid={uuid}
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
          step={3}
          totalSteps={4}
          back={prevStep}
          brolympics={brolympics}
          h2hEvents={h2hEvents}
          indEvents={indEvents}
          teamEvents={teamEvents}
          ffaEvents={ffaEvents}
          onCreate={createBrolympics}
          creating={creating}
        />
        <AddPlayers
          step={4}
          totalSteps={4}
          link={link}
          broName={brolympics?.name}
          leagueUuid={uuid}
          onComplete={finish}
        />
      </div>
    </div>
  );
};

export default CreateBrolympicsManager;
