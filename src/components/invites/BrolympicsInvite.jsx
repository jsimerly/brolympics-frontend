import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {fetchBrolympicsInvite, fetchJoinBrolympics} from '../../api/fetchInvites.js'
import InviteWrapper from "./InviteWrapper.jsx";


const Card = ({info}) => (
  <div className="flex flex-col items-center justify-center w-full h-full gap-3">
    <h2 className="text-[20px] text-center max-w-[280px]">
      You've been invited to join: <span className="font-semibold">{info.league_owner}</span>
    </h2>
    <div className="flex flex-col w-full gap-3 p-3 border rounded-md border-primary">
      <div className="flex gap-3">
        <img src={info.img} className="rounded-md w-[80px] h-[80px]"/>
        <div className="flex flex-col items-start justify-center h-full">
          <h2 className="text-[30px] leading-none font-bold">{info.name}</h2>
        </div>
      </div>
      {info.events.length > 0 &&
          <div className="flex">
            <span className="py-1 font-semibold">Events:</span>
            <ul className="flex gap-2 ml-2">
              {info.events.map((event, i) => (
                <div key={i+'_invite_events'} className="px-2 py-1 border rounded-md border-primary">{event.name}</div>
              ))}
            </ul>
          </div>
      }
    </div>
  </div>
)

const BrolympicsInvite = () => {

  return (
    <InviteWrapper
      fetchInfo={fetchBrolympicsInvite}
      fetchJoin={fetchJoinBrolympics}
      joinText={'Join Brolympics'}
    >
      <Card/>
    </InviteWrapper>
  )
}

export default BrolympicsInvite