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
        <div>{name}</div>
      </div>
      <div className="text-[16px] px-1">{score}</div>
    </div>
  );
};

const BracketNode = ({ match }) => {
  return (
    match && (
      <div className="flex gap-1">
        <div className="flex flex-col gap-1">
          <TeamNode
            name={match.team_1.name}
            img={match.team_1.img}
            score={match.team_1_score}
            seed={match.team_1_seed}
          />
          <TeamNode
            name={match.team_2.name}
            img={match.team_2.img}
            score={match.team_2_score}
            seed={match.team_2_seed}
          />
        </div>
        <div className="flex items-center pl-3">
          <div className="h-[2px] bg-black w-[16px]" />
        </div>
      </div>
    )
  );
};
export default BracketNode;
