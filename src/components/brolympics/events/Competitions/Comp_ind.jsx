import React from "react";

const Comp_ind = ({ entries = [], is_complete }) => {
  const teamEntry = entries.find((e) => e.team && !e.player);
  const playerEntries = entries.filter((e) => e.player);

  return (
    <div className="flex flex-col px-6 py-3 card">
      <h3 className="flex items-center gap-2 pb-1 font-semibold">
        <img
          src={teamEntry?.team_img}
          className="rounded-md w-[30px] h-[30px]"
        />
        {teamEntry?.team_name}
      </h3>

      {is_complete ? (
        <div className="text-[14px]">
          {playerEntries.map((entry) => (
            <div className="flex" key={entry.player}>
              <p>{entry.player_name}</p>: {entry.score}
            </div>
          ))}
          {teamEntry?.score != null && (
            <div className="flex font-bold">
              <p>Team</p>: {teamEntry.score}
            </div>
          )}
        </div>
      ) : (
        <div className="text-[12px]">
          This team has not completed this event yet.
        </div>
      )}
    </div>
  );
};

export default Comp_ind;
