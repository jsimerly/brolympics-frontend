import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const LeagueCard = ({ name, img, founded, is_owner, uuid }) => {
  const navigate = useNavigate();

  const onLeagueClick = () => {
    navigate(`/league/${uuid}`);
  };

  return (
    <div
      className="flex items-center gap-4 p-4 card-clickable"
      onClick={onLeagueClick}
    >
      <img className="object-cover w-16 h-16 rounded-lg" src={img} alt={name} />
      <div className="flex flex-col flex-grow">
        <h2 className="header-4 text-near-black">{name}</h2>
        <span className="text-sm text-light">Founded: {founded}</span>
      </div>
      {is_owner && (
        <div className="text-primary">
          <AutoAwesomeIcon sx={{ fontSize: 24 }} />
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-grow container-padding">
        <h1 className="my-6 header">Leagues</h1>
        <div className="space-y-4">
          {leagues.length > 0 ? (
            leagues.map((league, i) => <LeagueCard key={i} {...league} />)
          ) : (
            <p className="text-light">You are not in any leagues yet.</p>
          )}
        </div>
      </div>

      <div className="py-6 container-padding">
        <button
          className="flex items-center justify-center w-full gap-2 btn primary-btn"
          onClick={createLeagueClicked}
        >
          <AddCircleOutlineIcon />
          <span>Create League</span>
        </button>
      </div>
    </div>
  );
};

export default Leagues;
