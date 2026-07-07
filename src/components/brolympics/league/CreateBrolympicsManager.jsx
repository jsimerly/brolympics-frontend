import CreateBrolympics from "../../create_league_page/CreateBrolympics";
import AddEvent from "../../create_league_page/AddEvent";
import AddPlayers from "../../create_league_page/AddPlayers";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";
import { createBrolympics as apiCreateBrolympics, createEvent } from "../../../api/client";

const CreateBrolympicsManager = () => {
  const [step, setStep] = useState(1);
  const [brolympics, setBrolympics] = useState({});
  const [h2hEvents, setH2hEvents] = useState([]);
  const [indEvents, setIndEvents] = useState([]);
  const [teamEvents, setTeamEvents] = useState([]);
  const [link, setLink] = useState();
  const { showNotification } = useNotification();
  const { uuid } = useParams();

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

  const defaultStages = {
    h2h: [
      { structure: "round_robin", config: { games_per_team: 4 } },
      { structure: "knockout", config: { take: 4, third_place: true, byes: "seeded" } },
    ],
    ind: [{ structure: "open_play", config: {} }],
    team: [{ structure: "open_play", config: {} }],
  };

  const createBrolympics = async () => {
    try {
      const newBro = await apiCreateBrolympics({ ...brolympics, league: uuid });
      const events = [
        ...h2hEvents.map((e) => ({ ...e, format: "h2h" })),
        ...indEvents.map((e) => ({ ...e, format: "ind" })),
        ...teamEvents.map((e) => ({ ...e, format: "team" })),
      ];
      for (const event of events) {
        await createEvent({
          brolympics: newBro.uuid,
          event_type_name: event.name,
          format: event.format,
          stages: defaultStages[event.format],
        });
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
          nextStep={nextStep}
          brolympicsState={brolympics}
          setBrolympics={setBrolympics}
        />
        <AddEvent
          step={2}
          h2hEvents={h2hEvents}
          indEvents={indEvents}
          teamEvents={teamEvents}
          setH2hEvents={setH2hEvents}
          setIndEvents={setIndEvents}
          setTeamEvents={setTeamEvents}
          createAll={createBrolympics}
          setLink={setLink}
        />
        <AddPlayers
          step={3}
          nextStep={nextStep}
          prevStep={prevStep}
          link={link}
        />
      </div>
    </div>
  );
};

export default CreateBrolympicsManager;
