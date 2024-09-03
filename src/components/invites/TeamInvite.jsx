import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchTeamInvite, fetchJoinTeam } from '../../api/fetchInvites.js'
import InviteWrapper from "./InviteWrapper.jsx";


const TeamInvite = () => {
  const Card = ({info}) => (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      <h2 className="text-[20px] text-center">
        You've been invited to join the team {info.name}.
      </h2>
      <div className="flex items-center justify-start w-full gap-6 px-6">
        <img src={info.img} className="rounded-md w-[80px] h-[80px]"/>
        <div>
          <div className="text-[40px] font-bold">
            {info.name}
          </div>
          {info.player_1 && <span>{info.player_1.full_name}</span>}
          {info.player_2 && <span>{info.player_2.full_name}</span>}
        </div>

      </div>
    </div>
  )
  
  return (
    <InviteWrapper
      fetchInfo={fetchTeamInvite}
      fetchJoin={fetchJoinTeam}
      joinText={'Join Team'}
    >
      <Card/>
    </InviteWrapper>
  )
}

export default TeamInvite