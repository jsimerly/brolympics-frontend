import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStartComp } from "../../../../api/activeBro/home";

const AvailableCompetition_team = ({ event, team, uuid, type }) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();

  const onStartClicked = async () => {
    try {
      const data = await fetchStartComp(uuid, type);
      navigate(`/b/${broUuid}/competition/${data.comp_uuid}`);
    } catch (error) {
      console.error("Error starting competition:", error);
    }
  };

  return (
    <div className="card">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold text-center">{event}</h2>
        <div className="flex items-center w-full">
          <div className="flex items-center space-x-4">
            <img
              src={team.img}
              alt={`${team.name} logo`}
              className="object-cover w-16 h-16 rounded-md"
            />
            <div className="text-lg font-bold">{team.name}</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <button
          className="w-full px-4 py-2 font-bold text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          onClick={onStartClicked}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default AvailableCompetition_team;
