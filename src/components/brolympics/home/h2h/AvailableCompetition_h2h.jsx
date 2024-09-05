import TeamsBlock from "./TeamBlock";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStartComp } from "../../../../api/activeBro/home";

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
  const createRecordString = (team) => {
    const wins = team.wins;
    const losses = team.losses;
    const ties = team.ties;

    return `${wins}-${losses}` + (ties ? `-${ties}` : "");
  };
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();

  const onStartClicked = async () => {
    try {
      const data = await fetchStartComp(uuid, type);
      navigate(`/b/${broUuid}/competition/${data.comp_uuid}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pb-3">
      <TeamsBlock
        name={event}
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
      <div className="flex items-center justify-center w-full pt-6">
        <button
          className="w-1/2 p-2 font-bold rounded-md bg-primary"
          onClick={onStartClicked}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default AvailableCompetition_h2h;
