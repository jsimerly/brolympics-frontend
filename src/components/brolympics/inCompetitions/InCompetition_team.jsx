import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchActiveComp_team,
  fetchSubmitComp_team,
} from "../../../api/activeBro/home";

const InCompetition_team = () => {
  const [teamScore, setTeamScore] = useState(0);
  const handleTeamScoreChange = (e) => setTeamScore(e.target.value);

  const { compUuid } = useParams();

  const [compData, setCompData] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchActiveComp_team(compUuid);
        setCompData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

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

  const isValidScore = (score) => {
    const minScore =
      compData.min_score === null ? -Infinity : compData.min_score;
    const maxScore =
      compData.max_score === null ? Infinity : compData.max_score;

    return score >= minScore && score <= maxScore;
  };

  const handleSumbitClicked = async () => {
    if (isValidScore(teamScore)) {
      try {
        const data = await fetchSubmitComp_team(compUuid, teamScore);
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    compData && (
      <div className="min-h-[calc(100vh-160px)] flex flex-col justify-between p-6">
        <div>
          <h2 className=" w-full text-center text-[20px] mb-3 font-semibold">
            {compData.event}
          </h2>
          <div className="flex items-center w-full gap-6 pb-6">
            <img
              src={compData.team.img}
              className="min-w-[80px] w-[80px] h-[80px] bg-white rounded-md items-center"
            />
            <h2
              className={`font-bold text-center text-[${getFontSize(
                compData.team.name
              )}]`}
            >
              {compData.team.name}{" "}
            </h2>
          </div>
          <div className="flex justify-center w-full">
            <input
              value={teamScore}
              onChange={handleTeamScoreChange}
              className="min-w-[80px] w-1/2 h-[60px] p-2 mx-6 rounded-md border outline-primary text-center text-[20px] font-semibold"
            />
          </div>
        </div>
        <button
          className="w-full p-3 mt-6 rounded-md bg-primary"
          onClick={handleSumbitClicked}
        >
          Submit Score
        </button>
      </div>
    )
  );
};

export default InCompetition_team;
