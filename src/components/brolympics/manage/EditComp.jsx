import { useEffect, useState } from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  fetchAllCompData,
  fetchUpdateH2hComp,
  fetchUpdateIndComp,
  fetchUpdateTeamComp,
} from "../../../api/activeBro/admin";
import { useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";

const H2hComp = ({ team_1, team_1_score, team_2, team_2_score, uuid }) => {
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
      const data = await fetchUpdateH2hComp(compData);
      showNotification("This competition has been updated.", "!border-primary");
    } catch (error) {
      showNotification(
        "There was an error when attemping to update this competition."
      );
    }
  };

  return (
    <div className="relative flex flex-col gap-1 p-2 border">
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
        className="absolute px-2 py-1 text-white rounded-md bottom-2 right-2 bg-primary"
        onClick={handleUpdateClicked}
      >
        Update
      </button>
    </div>
  );
};

const IndComp = ({ team, player_1_score, player_2_score, uuid }) => {
  const { showNotification } = useNotification();
  const [compData, setCompData] = useState({
    uuid: uuid,
    player_1_score: player_1_score,
    player_2_score: player_2_score,
  });
  const handlePlayer1ScoreChange = (e) => {
    setCompData({
      ...compData,
      player_1_score: e.target.value,
    });
  };
  const handlePlayer2ScoreChange = (e) => {
    setCompData({
      ...compData,
      player_2_score: e.target.value,
    });
  };

  const handleUpdateClicked = async () => {
    try {
      const data = await fetchUpdateIndComp(compData);
      showNotification("This competition has been updated", "!border-primary");
    } catch (error) {
      showNotification(
        "There was an error when attemping to update this competition."
      );
    }
  };

  return (
    <div className="relative flex flex-col gap-1 p-2 border">
      {team.name}
      <div className="flex items-center">
        <div>{team.player_1?.short_name || "Player 1"}:</div>
        <input
          value={compData.player_1_score}
          onChange={handlePlayer1ScoreChange}
          className="p-2 rounded-md w-[60px] border ml-1"
        />
      </div>
      <div className="flex items-center">
        <div>{team.player_2?.short_name || "Player 2"}:</div>
        <input
          value={compData.player_2_score}
          onChange={handlePlayer2ScoreChange}
          className="p-2 rounded-md w-[60px] border ml-1"
        />
      </div>
      <button
        className="absolute px-2 py-1 text-white rounded-md bottom-2 right-2 bg-primary"
        onClick={handleUpdateClicked}
      >
        Update
      </button>
    </div>
  );
};

const TeamComp = ({ team, team_score, uuid }) => {
  const { showNotification } = useNotification();
  const [compData, setCompData] = useState({
    uuid: uuid,
    team_score: team_score,
  });
  const handleTeamScoreChange = (e) =>
    setCompData({ ...compData, team_score: e.target.value });

  const handleUpdateClicked = async () => {
    try {
      const data = await fetchUpdateTeamComp(compData);
      showNotification("This competition has been updated", "!border-primary");
    } catch (error) {
      showNotification(
        "There was an error when attemping to update this competition."
      );
    }
  };
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div>
        {team.name}:
        <input
          value={team_score}
          onChange={handleTeamScoreChange}
          className="p-2 rounded-md w-[60px] border ml-1"
        />
      </div>
      <button
        className="px-2 py-1 text-white rounded-md bottom-2 right-2 bg-primary"
        onClick={handleUpdateClicked}
      >
        Update
      </button>
    </div>
  );
};

const ClickCard = ({ event, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div className="w-full py-3">
      <div onClick={handleToggle} className="flex justify-between pb-3">
        <h3 className="font-semibold text-[18px]">{event.name}</h3>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>

      {isOpen && children}
    </div>
  );
};

const EditComp = () => {
  const [h2hEvents, setH2hEvents] = useState([]);
  const [indEvents, setIndEvents] = useState([]);
  const [teamEvents, setTeamEvents] = useState([]);
  const { uuid } = useParams();
  const { showNotification } = useNotification();

  useEffect(() => {
    const getComps = async () => {
      try {
        const data = await fetchAllCompData(uuid);
        setH2hEvents(data["h2h"]);
        setIndEvents(data["ind"]);
        setTeamEvents(data["team"]);
      } catch (error) {
        showNotification("Unable to connect to get your competition data.");
      }
    };
    getComps();
  }, []);

  return (
    <div>
      {indEvents.length != 0 && (
        <div>
          <h2 className="font-bold">Individual Events</h2>
          <ul>
            {indEvents.map((event, i) => (
              <div key={i + "_ind_event_edit"}>
                {i !== 0 && <div className="w-full" />}
                <ClickCard event={event}>
                  <ul className="space-y-2">
                    {event.comps.map((comp, i) => (
                      <IndComp {...comp} key={i + "_ind_edit_comp"} />
                    ))}
                    {event.comps.length == 0 &&
                      "This event has not been started yet."}
                  </ul>
                </ClickCard>
              </div>
            ))}
          </ul>
        </div>
      )}
      {h2hEvents.length != 0 && (
        <div>
          <h2 className="font-bold">Head to Head Events</h2>
          <ul>
            {h2hEvents.map((event, i) => (
              <div key={i + "_h2h_event_edit"}>
                {i !== 0 && <div className="w-full" />}
                <ClickCard event={event}>
                  <ul className="space-y-2">
                    {event.comps.map((comp, i) => (
                      <H2hComp {...comp} key={i + "_h2h_edit_comp"} />
                    ))}
                    {event.comps.length == 0 &&
                      "This event has not been started yet."}
                  </ul>
                </ClickCard>
              </div>
            ))}
          </ul>
        </div>
      )}
      {teamEvents.length != 0 && (
        <div>
          <h2 className="font-bold">Team Events</h2>
          <ul>
            {teamEvents.map((event, i) => (
              <div key={i + "_team_event_edit"}>
                {i !== 0 && <div className="w-full" />}
                <ClickCard event={event}>
                  <ul className="space-y-2">
                    {event.comps.map((comp, i) => (
                      <TeamComp {...comp} key={i + "_team_edit_comp"} />
                    ))}
                    {event.comps.length == 0 &&
                      "This event has not been started yet."}
                  </ul>
                </ClickCard>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EditComp;
