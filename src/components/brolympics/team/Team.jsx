import TeamsDropdown from "./TeamsDropdown";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

import Event_h2h from "./events/Event_h2h";
import Event_ind from "./events/Event_ind";
import Event_team from "./events/Event_team";

import { fetchTeamInfo } from "../../../api/activeBro/teams";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Team = ({ teams, default_uuid }) => {
  let { teamUuid } = useParams();
  let navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState();
  const [teamInfo, setTeamInfo] = useState();

  useEffect(() => {
    if (!teamUuid && default_uuid) {
      navigate(`/team/${default_uuid}`);
    }
  }, [teamUuid]);

  useEffect(() => {
    const getTeamInfo = async () => {
      try {
        const data = await fetchTeamInfo(teamUuid);
        setTeamInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    getTeamInfo();
  }, [teamUuid]);

  const TeamInfo = ({ team, player_1, player_2 }) => {
    const getOrdinalSuffix = (number) => {
      let suffix = "";
      if (number % 100 >= 11 && number % 100 <= 13) {
        suffix = "th";
      } else {
        switch (number % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
          default:
            suffix = "th";
            break;
        }
      }
      return suffix;
    };

    return (
      <div className="flex items-center justify-center w-full gap-3 px-6">
        <div className="flex flex-col items-center justify-center w-full p-3 border rounded-md border-primary">
          <div className="flex justify-around w-3/4 py-3 pb-6">
            <span className="font-bold text-[18px] text-center">
              {team.player_1?.full_name || "Player 1"}
            </span>
            <span className="font-bold text-[18px] text-center">
              {team.player_2?.full_name || "Player 2"}
            </span>
          </div>
          <div className="flex justify-center w-full gap-6">
            <div className="flex">
              <NumbersOutlinedIcon className="text-primary" />
              <span className="text-[16px] font-bold pl-3 flex">
                {team.overall_ranking?.rank}
                <span className="text-[10px] flex items-start ml-[1px] mt-[2px]">
                  {getOrdinalSuffix(team.overall_ranking?.rank)}
                </span>
              </span>
            </div>
            <div className="flex">
              <DiamondOutlinedIcon className="text-primary" />
              <span className="text-[16px] font-bold pl-3">
                {team.overall_ranking?.total_points} pts
              </span>
            </div>
            <div className="flex">
              <EmojiEventsOutlinedIcon className="text-primary" />
              <span className="text-[16px] font-bold pl-3">
                {team.overall_ranking?.event_wins}
              </span>
            </div>
            <div className="flex">
              <LeaderboardOutlinedIcon className="text-primary" />
              {/* <img src={Podium} className="text-white h-[26px] w-[26px]"/> */}
              <span className="text-[16px] font-bold pl-3">
                {team.overall_ranking?.event_podiums}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getEventComponent = (type, props) => {
    switch (type) {
      case "h2h":
        return <Event_h2h {...props} team={teamUuid} />;
      case "ind":
        return <Event_ind {...props} team={teamInfo.team} />;
      case "team":
        return <Event_team {...props} team={teamInfo.team} />;
    }
  };

  return (
    <div className="w-full">
      {teams && (
        <TeamsDropdown
          teams={teams}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
        />
      )}
      {teamInfo && <TeamInfo {...teamInfo} />}

      <div className="py-3">
        <h2 className="text-[20px] font-bold px-6">Events</h2>
        {teamInfo &&
          teamInfo.events.map((event, i) => (
            <div key={i + "_teams"}>
              {i !== 0 && (
                <div className="w-full px-6">
                  <div className="w-full h-[1px] bg-neutralLight" />
                </div>
              )}
              {getEventComponent(event.type, event)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Team;
