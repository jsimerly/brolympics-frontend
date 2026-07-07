import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startContest } from "../../../../api/client";
import TeamsBlock from "./TeamBlock";

const AvailableCompetition_h2h = ({ event_name, entries = [], uuid, round, stage }) => {
  const [entry_1, entry_2] = entries;
  const is_bracket = entry_1?.seed != null;
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();

  const onStartClicked = async () => {
    try {
      await startContest(uuid);
      navigate(`/b/${broUuid}/competition/${uuid}`);
    } catch (error) {
      console.error("Error starting competition:", error);
    }
  };

  return (
    <div className="overflow-hidden bg-white card">
      <h3 className="p-2 mb-4 text-lg font-semibold text-center text-white bg-primary">
        {event_name}
      </h3>
      <div className="p-4">
        <TeamsBlock
          name={""}
          team_1_name={entry_1?.team_name}
          team_1_img={entry_1?.team_img}
          team_1_seed={entry_1?.seed}
          team_2_name={entry_2?.team_name}
          team_2_img={entry_2?.team_img}
          team_2_seed={entry_2?.seed}
          is_bracket={is_bracket}
        />
      </div>
      <div className="px-4 py-3 bg-gray-50">
        <button
          className="w-full px-4 py-2 font-bold transition-colors duration-300 border rounded-md border-primary"
          onClick={onStartClicked}
        >
          Start Competition
        </button>
      </div>
    </div>
  );
};

export default AvailableCompetition_h2h;
