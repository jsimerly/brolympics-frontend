import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStartComp } from "../../../../api/activeBro/home";
import TeamsBlock from "./TeamBlock";

const AvailableCompetition_h2h = ({
  event,
  team_1,
  team_2,
  uuid,
  type,
  team_1_seed,
  team_2_seed,
  is_bracket,
  team_1_record,
  team_2_record,
}) => {
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
    <div className="overflow-hidden bg-white card">
      <h3 className="p-2 mb-4 text-lg font-semibold text-center text-white bg-primary">
        {event}
      </h3>
      <div className="p-4">
        <TeamsBlock
          name={""}
          team_1_name={team_1.name}
          team_1_record={team_1_record}
          team_1_img={team_1.img}
          team_1_seed={team_1_seed}
          team_2_name={team_2.name}
          team_2_record={team_2_record}
          team_2_img={team_2.img}
          team_2_seed={team_2_seed}
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
