import React from "react";

const Comp_team = ({ entries = [], is_complete }) => {
  const teamEntry = entries.find((e) => e.team && !e.player) || entries[0];

  return (
    <div className="flex justify-between px-6 py-3 card">
      <div className="flex items-center gap-2 font-semibold">
        <img
          src={teamEntry?.team_img}
          className="rounded-md w-[30px] h-[30px]"
        />
        {teamEntry?.team_name}
      </div>
      <div>{is_complete ? teamEntry?.score : "—"}</div>
    </div>
  );
};

export default Comp_team;
