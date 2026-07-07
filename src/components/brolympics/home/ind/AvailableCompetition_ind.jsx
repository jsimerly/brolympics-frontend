import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startContest } from "../../../../api/client";

const AvailableCompetition_ind = ({ event_name, entries = [], uuid }) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();
  const entry = entries.find((e) => e.team && !e.player) || entries[0];

  const onStartClicked = async () => {
    try {
      await startContest(uuid);
      navigate(`/b/${broUuid}/competition/${uuid}`);
    } catch (error) {
      console.error("Error starting competition:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="p-2 mb-4 text-lg font-semibold text-center text-white bg-primary">
        {event_name}
      </h2>
      <div className="p-4">
        <div className="flex items-center w-full">
          <div className="flex items-center space-x-4">
            <img
              src={entry?.team_img}
              alt={`${entry?.team_name} logo`}
              className="object-cover w-16 h-16 rounded-md"
            />
            <div className="text-lg font-bold">{entry?.team_name}</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <button
          className="w-full px-4 py-2 font-bold border rounded-md border-primary"
          onClick={onStartClicked}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default AvailableCompetition_ind;
