import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import {
  fetchBracketData,
  fetchUpdateBracketMatch,
} from "../../../api/activeBro/admin";
import { useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";

const ClickCard = ({ event, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div className="w-full py-3">
      <div onClick={handleToggle} className="flex justify-between pb-3">
        <h3 className="font-semibold text-[18px]">{event.event}</h3>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>

      {isOpen && children}
    </div>
  );
};

const MatchupCard = ({ uuid, team_1, team_1_score, team_2, team_2_score }) => {
  const { showNotification } = useNotification();
  const [compData, setCompData] = useState({
    uuid: uuid,
    team_1_score: team_1_score,
    team_2_score: team_2_score,
  });

  const handleTeam1ScoreChange = (e) => {
    setCompData({
      ...compData,
      team_1_score: e.target.value,
    });
  };

  const handleTeam2ScoreChange = (e) => {
    setCompData({
      ...compData,
      team_2_score: e.target.value,
    });
  };

  const handleUpdateClicked = async () => {
    try {
      console.log(compData);
      const data = await fetchUpdateBracketMatch(compData);
      showNotification("This competition has been updated.", "!border-primary");
    } catch (error) {
      showNotification(
        "There was an error when attemping to update this competition."
      );
    }
  };

  return (
    <div className="relative flex flex-col gap-1 p-2 border rounded-md">
      <div className="flex items-center">
        <div>{team_1.name || "Team 1"}:</div>
        <input
          value={compData.team_1_score || ""}
          onChange={handleTeam1ScoreChange}
          className="p-2 rounded-md w-[60px] border ml-1"
        />
      </div>
      <div className="flex items-center">
        <div>{team_2.name || "Team 2"}:</div>
        <input
          value={compData.team_2_score || ""}
          onChange={handleTeam2ScoreChange}
          className="p-2 rounded-md w-[60px] border ml-1"
        />
      </div>
      <button
        className="absolute px-2 py-1 rounded-md bottom-2 right-2 bg-primary"
        onClick={handleUpdateClicked}
      >
        Update
      </button>
    </div>
  );
};

const EditBracket = () => {
  const { uuid } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchBracketData(uuid);
        setEvents(data);
      } catch (error) {
        console.log(error);
      }
    };
    getEvents();
  }, []);

  return (
    <div>
      Brackets
      <div>
        {events.map((event, i) => (
          <ClickCard event={event} key={i + "_event_card"}>
            <div className="space-y-2">
              <h2 className="font-semibold">Round 1</h2>
              <MatchupCard {...event.match_1} />
              <MatchupCard {...event.match_2} />
              <h2 className="font-semibold"> Losers Finals</h2>
              <MatchupCard {...event.loser_bracket_finals} />
              <h2 className="font-semibold"> Championship</h2>
              <MatchupCard {...event.championship} />
            </div>
          </ClickCard>
        ))}
      </div>
    </div>
  );
};

export default EditBracket;
