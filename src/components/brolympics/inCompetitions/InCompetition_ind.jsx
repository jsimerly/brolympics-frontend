import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchActiveComp_ind,
  fetchSubmitComp_ind,
  fetchCancelComp_ind,
} from "../../../api/activeBro/home";
import { useNotification } from "../../Util/Notification";

const InCompetition_ind = () => {
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const { compUuid } = useParams();
  const { showNotification } = useNotification();
  const [compData, setCompData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchActiveComp_ind(compUuid);
        setCompData(data);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        showNotification("Error loading competition data", "border-red-500");
      }
    };
    getData();
  }, [compUuid]);

  const handleScoreChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const isValidScore = (score) => {
    const numScore = Number(score);
    const minScore = compData.min_score ?? -Infinity;
    const maxScore = compData.max_score ?? Infinity;
    return numScore >= minScore && numScore <= maxScore;
  };

  const handleSubmitClicked = async () => {
    if (isValidScore(player1Score) && isValidScore(player2Score)) {
      try {
        await fetchSubmitComp_ind(
          compUuid,
          Number(player1Score),
          Number(player2Score)
        );
        showNotification("Scores submitted successfully", "border-primary");
        window.location.reload();
      } catch (error) {
        console.error("Error submitting scores:", error);
        showNotification("Error submitting scores", "border-red-500");
      }
    } else {
      showNotification(
        <>
          Please enter valid scores for each player.
          <br />
          Min Score: {compData.min_score ?? "No min"}
          <br />
          Max Score: {compData.max_score ?? "No max"}
        </>,
        "border-yellow-500"
      );
    }
  };

  const handleCancelClicked = async () => {
    try {
      await fetchCancelComp_ind(compUuid);
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling competition:", error);
      showNotification("Error cancelling competition", "border-red-500");
    }
  };

  if (!compData) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-between p-2">
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-4 text-white bg-primary">
          <h2 className="text-xl font-bold text-center">{compData.event}</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={compData.team.img}
              alt={`${compData.team.name} logo`}
              className="object-cover w-20 h-20 rounded-md"
            />
            <h3 className="text-3xl font-semibold">{compData.team.name}</h3>
          </div>
          {[compData.team.player_1, compData.team.player_2].map(
            (player, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4 last:mb-0"
              >
                <span className="text-lg">
                  {player?.short_name || `Player ${index + 1}`}
                </span>
                <input
                  value={index === 0 ? player1Score : player2Score}
                  onChange={handleScoreChange(
                    index === 0 ? setPlayer1Score : setPlayer2Score
                  )}
                  className="w-20 h-12 text-lg font-semibold text-center border-2 border-gray-300 rounded-md focus:border-primary focus:ring-2 focus:ring-primary-light"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="w-1/3 p-3 font-semibold transition-colors duration-300 border-2 rounded-md text-primary border-primary hover:bg-primary hover:text-white"
          onClick={handleCancelClicked}
        >
          Cancel
        </button>
        <button
          className="w-2/3 p-3 font-semibold text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-dark"
          onClick={handleSubmitClicked}
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export default InCompetition_ind;
