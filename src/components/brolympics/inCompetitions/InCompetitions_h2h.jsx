import React, { useState } from "react";
import { recordContest, abandonContest } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import Img from "../../Util/Img";

const InCompetitions_h2h = ({ contest }) => {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const { showNotification } = useNotification();

  const [entry_1, entry_2] = contest.entries;

  const handleScoreChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmitClicked = async () => {
    if (team1Score === "" || team2Score === "") {
      showNotification("Enter a score for both teams", "border-red-500");
      return;
    }
    try {
      await recordContest(contest.uuid, {
        scores: {
          [entry_1.team]: Number(team1Score),
          [entry_2.team]: Number(team2Score),
        },
      });
      showNotification("Competition updated successfully", "border-primary");
      window.location.reload();
    } catch (error) {
      const detail = error.response?.data;
      if (error.response?.status === 400 && detail) {
        showNotification(String(detail[0] ?? detail), "border-yellow-500");
      } else {
        showNotification("Error updating competition", "border-red-500");
      }
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      window.location.reload();
    } catch (error) {
      showNotification("Error cancelling competition", "border-red-500");
    }
  };

  return (
    <div className="min-h-[calc(100vh-240px)] p-6 flex flex-col justify-between bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-center">
          {contest.event_name}
        </h2>
        {[entry_1, entry_2].map((entry, index) => (
          <div key={entry.team} className="p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Img
                src={entry.team_img}
                alt={`${entry.team_name} logo`}
                className="object-cover w-20 h-20 rounded-md"
              />
              <div className="flex-grow">
                <h4 className="text-xl font-semibold">{entry.team_name}</h4>
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
