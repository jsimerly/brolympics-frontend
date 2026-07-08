import React from "react";

export const TeamNode = ({ name, seed, score, img }) => {
  let fontSize;
  if (name) {
    if (name.length <= 10) {
      fontSize = "16px";
    } else if (name.length <= 16) {
      fontSize = "14px";
    } else if (name.length <= 20) {
      fontSize = "12px";
    } else {
      fontSize = "10px";
    }
  }

  return (
    <div
      className={`p-1 border rounded-md border-black h-[40px] flex gap-1 items-center justify-between w-[200px] min-w-[200px]`}
      style={{ fontSize }}
    >
      <div className="flex items-center justify-start gap-1">
        {img ? (
          <img src={img} className="h-[30px] w-[30px] rounded-md" />
        ) : (
          <div className="w-[30px] h-[30px]" />
        )}

        <div className="text-[12px]">{seed}</div>
        <div>{name || "TBD"}</div>
      </div>
      <div className="text-[16px] px-1">{score}</div>
    </div>
  );
};

const BracketNode = ({ contest }) => {
  if (!contest) return null;
  const [entry_1, entry_2] = contest.entries || [];
  return (
    <div className="flex gap-1">
      <div className="flex flex-col gap-1">
        <TeamNode
          name={entry_1?.team_name}
          img={entry_1?.team_img}
          score={entry_1?.score}
          seed={entry_1?.seed}
        />
        <TeamNode
          name={entry_2?.team_name}
          img={entry_2?.team_img}
          score={entry_2?.score}
          seed={entry_2?.seed}
        />
      </div>
    </div>
  );
};
export default BracketNode;
