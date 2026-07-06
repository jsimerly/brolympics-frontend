import InviteWrapper from "./InviteWrapper.jsx";
import { fetchLeagueInvite, joinLeague } from "../../api/client";

const LeagueInvite = () => {
  const Card = ({ info }) => (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      <h2 className="text-[20px] text-center max-w-[280px]">
        You've been invited to join a league:
      </h2>
      <div className="flex w-full gap-3 p-3 border rounded-md border-primary">
        {info.img && (
          <img src={info.img} className="rounded-md w-[80px] h-[80px]" />
        )}
        <div className="flex flex-col items-start justify-center h-full">
          <h2 className="text-[30px] leading-none font-bold">{info.name}</h2>
          {info.detail && <span className="ml-1">{info.detail}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <InviteWrapper
      fetchInfo={fetchLeagueInvite}
      fetchJoin={joinLeague}
      joinText={"Join League"}
    >
      <Card />
    </InviteWrapper>
  );
};

export default LeagueInvite;
