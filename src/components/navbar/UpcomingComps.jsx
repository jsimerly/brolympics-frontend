import DataList from "./DataList";
import { useNavigate } from "react-router-dom";

/** One of my open contests: event name + who's playing. */
const Card = (contest, index, setOpen) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/b/${contest.brolympics}/home`);
    setOpen(false);
  };

  const participants = contest.entries
    .map((e) => e.team_name ?? e.player_name)
    .filter(Boolean)
    .join(" vs ");

  return (
    <div
      className="flex items-center w-full gap-3 p-3 rounded-md"
      key={index + "_comps_upcoming"}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <h3 className="text-[18px]">{contest.event_name}</h3>
        {participants && (
          <div className="text-[14px] ml-1 opacity-60">{participants}</div>
        )}
      </div>
    </div>
  );
};

const UpcomingCompetitions = ({ upcoming_competitions, setOpen }) => {
  return (
    <>
      {upcoming_competitions.length !== 0 && (
        <DataList
          title="Upcoming Competitions"
          data={upcoming_competitions}
          card={Card}
          setOpen={setOpen}
        />
      )}
    </>
  );
};

export default UpcomingCompetitions;
