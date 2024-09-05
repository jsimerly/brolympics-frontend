import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchActiveComp_ind,
  fetchSubmitComp_ind,
  fetchCancelComp_ind,
} from "../../../api/activeBro/home";
import { useNotification } from "../../Util/Notification";

const InCompetition_ind = () => {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const handlePlayer1ScoreChange = (e) => setPlayer1Score(e.target.value);
  const handlePlayer2ScoreChange = (e) => setPlayer2Score(e.target.value);

  const { compUuid } = useParams();
  const { showNotification } = useNotification();

  const [compData, setCompData] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchActiveComp_ind(compUuid);
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
    if (isValidScore(player1Score) && isValidScore(player2Score)) {
      try {
        const data = await fetchSubmitComp_ind(
          compUuid,
          player1Score,
          player2Score
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      showNotification(
        <>
          Please enter valid scores for each player.
          <br />
          Min Score:{" "}
          {compData.min_score !== undefined && compData.min_score !== null
            ? compData.min_score
            : "No min"}
          <br /> Max Score: {compData.max_score || "No max"}
        </>
      );
    }
  };

  const handleCancelClicked = async () => {
    try {
      const data = await fetchCancelComp_ind(compUuid);
      location.reload();
    } catch (error) {
      showNotification(
        "There was an issue attempting to cancel this competition"
      );
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
          <div className="">
            <div className="">
              <div className="flex items-center justify-start flex-1 gap-3">
                <h4 className={`w-full py-2 text-start text-[30px]`}>
                  {compData.team.player_1?.short_name || "Player 1"}
                </h4>
                <div className="flex justify-center w-1/2">
                  <input
                    value={player1Score}
                    onChange={handlePlayer1ScoreChange}
                    className="min-w-[80px] w-[80px] h-[60px] p-2 mx-6 rounded-md bg-neutralLight border outline-primary"
                  />
                </div>
              </div>
              <div className="py-6" />
              <div className="flex items-center justify-start flex-1 gap-3">
                <h4 className={`w-full py-2 text-start text-[30px]`}>
                  {compData.team.player_2?.short_name || "Player 2"}
                </h4>
                <div className="flex justify-center w-1/2">
                  <input
                    value={player2Score}
                    onChange={handlePlayer2ScoreChange}
                    className="min-w-[80px] w-[80px] h-[60px] p-2 mx-6 rounded-md bg-neutralLight border outline-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="w-1/3 p-3 mt-6 border rounded-md border-primary"
            onClick={handleCancelClicked}
          >
            Cancel
          </button>
          <button
            className="w-2/3 p-3 mt-6 rounded-md bg-primary"
            onClick={handleSumbitClicked}
          >
            Submit Score
          </button>
        </div>
      </div>
    )
  );
};

export default InCompetition_ind;
