import { useState } from "react";
import { recordContest, abandonContest } from "../../../api/client";

const InCompetition_team = ({ contest }) => {
  const [teamScore, setTeamScore] = useState("");
  const handleTeamScoreChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTeamScore(value);
    }
  };

  const entry =
    contest.entries.find((e) => e.team && !e.player) || contest.entries[0];

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 10) {
        return "30px";
      } else if (name.length <= 16) {
        return "28px";
      } else if (name.length <= 20) {
        return "26px";
      } else {
        return "22px";
      }
    }
  };

  const handleSumbitClicked = async () => {
    if (teamScore === "") return;
    try {
      await recordContest(contest.uuid, { team_score: Number(teamScore) });
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-between p-6">
      <div>
        <h2 className=" w-full text-center text-[20px] mb-3 font-semibold">
          {contest.event_name}
        </h2>
        <div className="flex items-center w-full gap-6 pb-6">
          <img
            src={entry?.team_img}
            className="min-w-[80px] w-[80px] h-[80px] bg-white rounded-md items-center"
          />
          <h2
            className={`font-bold text-center text-[${getFontSize(
              entry?.team_name
            )}]`}
          >
            {entry?.team_name}{" "}
          </h2>
        </div>
        <div className="flex justify-center w-full">
          <input
            value={teamScore}
            onChange={handleTeamScoreChange}
            className="min-w-[80px] w-1/2 h-[60px] p-2 mx-6 rounded-md border outline-primary text-center text-[20px] font-semibold"
            inputMode="numeric"
            pattern="\d*"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          className="w-1/3 p-3 font-semibold border-2 rounded-md text-primary border-primary"
          onClick={handleCancelClicked}
        >
          Cancel
        </button>
        <button
          className="w-2/3 p-3 rounded-md bg-primary"
          onClick={handleSumbitClicked}
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export default InCompetition_team;
