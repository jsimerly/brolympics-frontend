import React from "react";
import { fetchTeamInvite, fetchJoinTeam } from "../../api/invites.js";
import InviteWrapper from "./InviteWrapper.jsx";

const TeamInvite = () => {
  const Card = ({ info }) => (
    <div className="w-full max-w-md p-6 mx-auto">
      <h2 className="mb-6 text-center header-3">
        You've been invited to join the team
      </h2>
      <div className="flex items-center gap-6 mb-6">
        <img
          src={info.img}
          alt={`${info.name} team logo`}
          className="object-cover w-24 h-24 rounded-md"
        />
        <div>
          <h3 className="header-2">{info.name}</h3>
          <div className="text-sm text-light">
            {info.player_1 && (
              <p className="mb-1">
                <span className="font-semibold">Player 1:</span>{" "}
                {info.player_1.full_name}
              </p>
            )}
            {info.player_2 && (
              <p>
                <span className="font-semibold">Player 2:</span>{" "}
                {info.player_2.full_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <InviteWrapper
      fetchInfo={fetchTeamInvite}
      fetchJoin={fetchJoinTeam}
      joinText="Join Team"
    >
      <Card />
    </InviteWrapper>
  );
};

export default TeamInvite;
