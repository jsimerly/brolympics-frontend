import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchActiveComp_h2h,
  fetchCancelComp_h2h,
  fetchSubmitComp_h2h,
} from "../../../api/activeBro/home";
import { useNotification } from "../../Util/Notification";

const InCompetitions_h2h = () => {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const { showNotification } = useNotification();
  const { compUuid } = useParams();
  const [compData, setCompData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchActiveComp_h2h(compUuid);
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
    if (isValidScore(team1Score) && isValidScore(team2Score)) {
      try {
        await fetchSubmitComp_h2h(
          compUuid,
          Number(team1Score),
          Number(team2Score)
        );
        showNotification("Competition updated successfully", "border-primary");
        window.location.reload();
      } catch (error) {
        if (error.response?.status === 409) {
          showNotification(
            "This competition was updated by someone else",
            "border-yellow-500"
          );
          window.location.reload();
        } else {
          showNotification("Error updating competition", "border-red-500");
        }
      }
    } else {
      showNotification("Invalid scores", "border-red-500");
    }
  };

  const handleCancelClicked = async () => {
    try {
      await fetchCancelComp_h2h(compUuid);
      window.location.reload();
    } catch (error) {
      showNotification("Error cancelling competition", "border-red-500");
    }
  };

  if (!compData) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-240px)] p-6 flex flex-col justify-between bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-center">
          {compData.event}
        </h2>
        {[compData.team_1, compData.team_2].map((team, index) => (
          <div key={team.name} className="p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={team.img}
                alt={`${team.name} logo`}
                className="object-cover w-20 h-20 rounded-md"
              />
              <div className="flex-grow">
                <h4 className="text-xl font-semibold">{team.name}</h4>
              </div>
              <input
                value={index === 0 ? team1Score : team2Score}
                onChange={handleScoreChange(
                  index === 0 ? setTeam1Score : setTeam2Score
                )}
                className="w-20 h-16 p-2 text-2xl font-bold text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                type="text"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <button
          className="flex-1 p-3 font-semibold transition-colors duration-300 border-2 rounded-md text-primary border-primary hover:bg-primary hover:text-white"
          onClick={handleCancelClicked}
        >
          Cancel
        </button>
        <button
          className="flex-1 p-3 font-semibold "
          onClick={handleSubmitClicked}
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export default InCompetitions_h2h;
