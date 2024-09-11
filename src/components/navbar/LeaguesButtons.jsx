import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DataList from "./DataList";
import { useNavigate } from "react-router-dom";

const Card = (league, index, setOpen) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/league/${league.uuid}`);
    setOpen(false);
  };

  return (
    <div
      className="flex items-center w-full gap-4 p-4 card-clickable"
      key={index}
      onClick={onClick}
    >
      <img
        src={league.img}
        alt={league.name}
        className="object-cover w-12 h-12 rounded-md"
      />
      <h3 className="header-4 text-near-black">{league.name}</h3>
    </div>
  );
};

const AddLeagueButton = ({ onClick }) => (
  <button
    className="flex items-center justify-center gap-2 mt-4 btn tertiary-btn"
    onClick={onClick}
  >
    <span>Add League</span>
    <AddCircleOutlineIcon className="w-5 h-5" />
  </button>
);

const LeaguesButtons = ({ leagues, setOpen }) => {
  const navigate = useNavigate();
  const addLeagueClick = () => {
    navigate(`/start-league`);
    setOpen(false);
  };

  return (
    <div className="p-2">
      <DataList title="Leagues" data={leagues} card={Card} setOpen={setOpen} />
      <AddLeagueButton onClick={addLeagueClick} />
    </div>
  );
};

export default LeaguesButtons;
