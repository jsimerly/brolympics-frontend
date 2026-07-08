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
import useCachedFetch from "../../../hooks/useCachedFetch";
import { SkeletonPage } from "../../Util/Skeleton";

const Team = ({ status, teams, default_uuid }) => {
  const { uuid, teamUuid } = useParams();
  const navigate = useNavigate();
  const [selectedTeamId, setSelectedTeamId] = useState(
    teamUuid || teams[0]?.uuid || ""
  );
  const { data: teamInfo, loading, refreshing } = useCachedFetch(
    selectedTeamId ? `team-info:${selectedTeamId}` : null,
    () => fetchTeamInfo(selectedTeamId)
  );

  useEffect(() => {
    if (!teamUuid) {
      const saved = localStorage.getItem(`selectedTeamUuid:${uuid}`);
      const target =
        (saved && teams.some((t) => t.uuid === saved) && saved) || default_uuid;
      if (target) navigate(`/b/${uuid}/team/${target}`);
    }
  }, [default_uuid, teamUuid]);

  useEffect(() => {
    if (teamUuid) {
      setSelectedTeamId(teamUuid);
    }
  }, [teamUuid]);

  const handleTeamChange = (e) => {
    const selectedTeam = teams.find((team) => team.uuid === e.target.value);
    if (selectedTeam) {
      localStorage.setItem(`selectedTeamUuid:${uuid}`, selectedTeam.uuid);
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
      <div className="flex flex-col items-center gap-1 p-3 text-center bg-white border rounded-lg">
        <div className="text-primary">{icon}</div>
        <span className="font-bold leading-none">{value}</span>
        <span className="text-[11px] text-light">{description}</span>
      </div>
    );

    return (
      <div className="p-4 mb-6 card">
        <div className="flex items-center gap-4 mb-4">
          <Img
            src={team.img}
            className="object-cover rounded-lg w-16 h-16"
          />
          <div className="flex flex-col">
              {(team.players || []).map((player) => (
                <span className="text-lg font-bold leading-tight" key={player.uuid}>
                  {player.name}
                </span>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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
                ? "bg-primary text-white border-primary"
                : "bg-white text-near-black border-gray-200"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>
      {loading && <SkeletonPage rows={4} />}
      <div
        className={`transition-opacity duration-200 ${
          refreshing ? "opacity-60" : "opacity-100"
        }`}
      >
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
    </div>
  );
};

export default Team;
