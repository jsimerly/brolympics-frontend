import CreateBrolympics from "../../create_league_page/CreateBrolympics";
import AddEvent from "../../create_league_page/AddEvent";
import AddPlayers from "../../create_league_page/AddPlayers";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";
import {
  createBrolympics as apiCreateBrolympics,
  createEvent,
  defaultStagesFor,
} from "../../../api/client";
import usePersistentState, {
  clearPersistentState,
} from "../../../hooks/usePersistentState";

const CreateBrolympicsManager = () => {
  const { uuid } = useParams();
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

  const nextStep = () => {
    if (step < 3) {
      setStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step) => step - 1);
    }
  };

  const createBrolympics = async () => {
    try {
      const newBro = await apiCreateBrolympics({ ...brolympics, league: uuid });
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
      console.log(error);
      showNotification(
        "There was an while trying to create your Brolymipcs. Please check back shortly."
      );
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
          totalSteps={3}
          nextStep={nextStep}
          setBrolympics={setBrolympics}
          storageKey={K("form")}
        />
        <AddEvent
          step={2}
          totalSteps={3}
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
          createAll={createBrolympics}
          setLink={setLink}
        />
        <AddPlayers
          step={3}
          totalSteps={3}
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
