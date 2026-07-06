import React from "react";
import { fetchBrolympicsInvite, joinBrolympics } from "../../api/client";
import InviteWrapper from "./InviteWrapper.jsx";

const Card = ({ info }) => (
  <div className="flex flex-col items-center w-full">
    <h2 className="mb-6 text-center header-3">You've been invited to join:</h2>
    <div className="w-full p-4 mb-6 card">
      <div className="flex items-center gap-4">
        {info.img && (
          <img
            src={info.img}
            alt={`${info.name} logo`}
            className="object-cover w-24 h-24 rounded-md"
          />
        )}
        <div>
          <h3 className="header-2 text-light">{info.name}</h3>
          {info.league_name && (
            <p className="text-sm text-tertiary">{info.league_name}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const BrolympicsInvite = () => (
  <InviteWrapper
    fetchInfo={fetchBrolympicsInvite}
    fetchJoin={joinBrolympics}
    joinText="Join Brolympics"
  >
    <Card />
  </InviteWrapper>
);

export default BrolympicsInvite;
