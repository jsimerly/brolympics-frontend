import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

import Img from "../../Util/Img";
import Event_h2h from "./events/Event_h2h";
import Event_outing from "./events/Event_outing";
import { fetchTeamInfo } from "../../../api/client";

const Team = ({ status, teams, default_uuid }) => {
  const { uuid, teamUuid } = useParams();
  const navigate = useNavigate();
  const [teamInfo, setTeamInfo] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(
    teamUuid || teams[0]?.uuid || ""
  );

  useEffect(() => {
    if (!teamUuid && default_uuid) {
      navigate(`/b/${uuid}/team/${default_uuid}`);
    }
  }, [default_uuid, teamUuid]);

  useEffect(() => {
    if (teamUuid) {
      setSelectedTeamId(teamUuid);
    }
  }, [teamUuid]);

  useEffect(() => {
    const getTeamInfo = async () => {
      try {
        const data = await fetchTeamInfo(selectedTeamId);
        setTeamInfo(data);
      } catch (error) {
        console.error("Error fetching team info:", error);
      }
    };
    if (selectedTeamId) {
      getTeamInfo();
    }
  }, [selectedTeamId]);

  const handleTeamChange = (e) => {
    const selectedTeam = teams.find((team) => team.uuid === e.target.value);
    if (selectedTeam) {
      localStorage.setItem("selectedTeamUuid", selectedTeam.uuid);
      navigate(`/b/${uuid}/team/${selectedTeam.uuid}`);
    }
  };

  const getOrdinalSuffix = (number) => {
    if (number === undefined || number === null) return "";
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const TeamInfo = ({ team }) => {
    const isPre = status === "pre" || status === "pre_admin";

    const StatItem = ({ icon, value, description }) => (
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-1">
          {React.cloneElement(icon, { className: "mr-2 text-tertiary" })}
          <span className="font-bold">{value}</span>
        </div>
        {isPre && <span className="text-sm text-light">{description}</span>}
      </div>
    );

    return (
      <div className="p-4 mb-6 card">
        <div className="flex flex-col justify-between mb-4 md:flex-row">
          <div className="flex items-center justify-start space-x-6">
            <div>
              <Img src={team.img} className="rounded-md w-[60px] h-[60px]" />
            </div>
            <div className="flex flex-col">
              {(team.players || []).map((player) => (
                <span className="text-lg font-bold" key={player.uuid}>
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatItem
            icon={<NumbersOutlinedIcon />}
            value={
              team.overall_ranking?.rank
                ? getOrdinalSuffix(team.overall_ranking.rank)
                : "-"
            }
            description="Current Ranking"
          />
          <StatItem
            icon={<DiamondOutlinedIcon />}
            value={
              team.overall_ranking?.total_points !== undefined
                ? `${team.overall_ranking.total_points} pts`
                : "-"
            }
            description="Total Points"
          />
          <StatItem
            icon={<EmojiEventsOutlinedIcon />}
            value={
              team.overall_ranking?.event_wins !== undefined
                ? `${team.overall_ranking.event_wins} wins`
                : "-"
            }
            description="Events Won"
          />
          <StatItem
            icon={<LeaderboardOutlinedIcon />}
            value={
              team.overall_ranking?.event_podiums !== undefined
                ? `${team.overall_ranking.event_podiums} podiums`
                : "-"
            }
            description="Total Podiums"
          />
        </div>
      </div>
    );
  };

  const getEventComponent = (type, props) => {
    const Component = type === "h2h" ? Event_h2h : Event_outing;
    return <Component {...props} teamUuid={selectedTeamId} />;
  };

  return (
    <div className="max-w-4xl p-2">
      <div
        className="flex gap-2 px-2 py-3 -mx-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {teams.map((team) => (
          <button
            key={team.uuid}
            onClick={() =>
              handleTeamChange({ target: { value: team.uuid } })
            }
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full border transition-colors ${
              team.uuid === selectedTeamId
                ? "bg-tertiary text-white border-tertiary"
                : "bg-white text-near-black border-gray-200"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>
      {teamInfo && <TeamInfo team={teamInfo.team} />}

      {teamInfo && teamInfo.events && teamInfo.events.length > 0 && (
        <div className="p-4 card">
          <h2 className="mb-4 header-3">Events</h2>
          {teamInfo.events.map((event, i) => (
            <div
              key={i}
              className={i !== 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}
            >
              {getEventComponent(event.type, event)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
