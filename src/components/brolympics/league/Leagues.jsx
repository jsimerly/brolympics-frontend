import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const LeagueCard = ({ name, img, founded, is_owner, uuid }) => {
  const navigate = useNavigate();

  const onLeagueClick = () => {
    navigate(`/league/${uuid}`);
  };

  return (
    <div className="flex items-center px-3 py-6" onClick={onLeagueClick}>
      <img className="h-[60px] min-w-[60px] w-[60px] rounded-md" src={img} />
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-[30px] font-bold w-full text-center"> {name}</h2>
        <span className=" text-center text-[14px]">Founded: {founded}</span>
      </div>
      {is_owner && (
        <div className="text-primary">
          <AutoAwesomeIcon sx={{ fontSize: 30 }} />
        </div>
      )}
    </div>
  );
};

const Leagues = ({ leagues }) => {
  const navigate = useNavigate();

  const createLeagueClicked = () => {
    navigate("/start-league");
  };

  const onSettingsClicks = () => {
    navigate("settings");
  };
  console.log(leagues);

  return (
    <div className="bg-neutral relative text-white min-h-[calc(100vh-80px)]">
      <div className="p-6">
        <h1 className="text-[26px] font-bold leading-none py-3">Leagues</h1>
        {leagues.map((league, i) => (
          <div key={i}>
            <LeagueCard {...league} />
            {i !== 0 && <div className="w-full h-[1px] bg-neutralLight" />}
          </div>
        ))}
        {leagues.length === 0 && "You are not in any leagues yet."}
      </div>

      <div className="fixed bottom-0 left-0 flex justify-between w-screen p-6 ">
        <button
          className="flex justify-between w-full p-3 px-6 rounded-md bg-primary"
          onClick={createLeagueClicked}
        >
          <AddCircleOutlineIcon />
          <span> Create League </span>
          <div />
        </button>
      </div>
    </div>
  );
};

export default Leagues;
