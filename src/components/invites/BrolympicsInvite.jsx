import React from "react";
import {
  fetchBrolympicsInvite,
  fetchJoinBrolympics,
} from "../../api/invites.js";
import InviteWrapper from "./InviteWrapper.jsx";

const Card = ({ info }) => (
  <div className="flex flex-col items-center w-full">
    <h2 className="mb-6 text-center header-3">You've been invited to join:</h2>
    <p className="mb-6 text-xl font-semibold">
      {info.league_owner.display_name}'s Brolympics
    </p>
    <div className="w-full p-4 mb-6 card">
      <div className="flex items-center gap-4 mb-4">
        {info.img && (
          <img
            src={info.img}
            alt={`${info.name} logo`}
            className="object-cover w-24 h-24 rounded-md"
          />
        )}
        <h3 className="header-2 text-light">{info.name}</h3>
      </div>
      {info.events.length > 0 && (
        <div>
          <h4 className="mb-2 header-4 text-tertiary">Events:</h4>
          <div className="flex flex-wrap gap-2">
            {info.events.map((event, i) => (
              <span
                key={i + "_invite_events"}
                className="px-2 py-1 text-sm text-white rounded-md bg-primary-light"
              >
                {event.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const BrolympicsInvite = () => {
  return (
    <InviteWrapper
      fetchInfo={fetchBrolympicsInvite}
      fetchJoin={fetchJoinBrolympics}
      joinText="Join Brolympics"
    >
      <Card />
    </InviteWrapper>
  );
};

export default BrolympicsInvite;
