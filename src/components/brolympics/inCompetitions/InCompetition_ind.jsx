import React, { useState, useEffect } from "react";
import { recordContest, abandonContest, fetchTeam } from "../../../api/client";
import { useNotification } from "../../Util/Notification";

const InCompetition_ind = ({ contest }) => {
  const [scores, setScores] = useState({});
  const [team, setTeam] = useState(null);
  const { showNotification } = useNotification();

  const teamEntry =
    contest.entries.find((e) => e.team && !e.player) || contest.entries[0];

  useEffect(() => {
    const getTeam = async () => {
      try {
        setTeam(await fetchTeam(teamEntry.team));
      } catch (error) {
        console.error("Error fetching team:", error);
        showNotification("Error loading competition data", "border-red-500");
      }
    };
    getTeam();
  }, [teamEntry.team]);

  const handleScoreChange = (playerUuid) => (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setScores((prev) => ({ ...prev, [playerUuid]: value }));
    }
  };

  const handleSubmitClicked = async () => {
    const missing = team.players.some((p) => !scores[p.uuid]?.length);
    if (missing) {
      showNotification(
        "Please enter a score for every player.",
        "border-yellow-500"
      );
      return;
    }
    try {
      await recordContest(contest.uuid, {
        player_scores: Object.fromEntries(
          team.players.map((p) => [p.uuid, Number(scores[p.uuid])])
        ),
      });
      showNotification("Scores submitted successfully", "border-primary");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting scores:", error);
      showNotification("Error submitting scores", "border-red-500");
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling competition:", error);
      showNotification("Error cancelling competition", "border-red-500");
    }
  };

  if (!team) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-between p-2">
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-4 text-white bg-primary">
          <h2 className="text-xl font-bold text-center">
            {contest.event_name}
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={team.img}
              alt={`${team.name} logo`}
              className="object-cover w-20 h-20 rounded-md"
            />
            <h3 className="text-3xl font-semibold">{team.name}</h3>
          </div>
          {team.players.map((player) => (
            <div
              key={player.uuid}
              className="flex items-center justify-between mb-4 last:mb-0"
            >
              <span className="text-lg">{player.name}</span>
              <input
                value={scores[player.uuid] || ""}
                onChange={handleScoreChange(player.uuid)}
                className="w-20 h-12 text-lg font-semibold text-center border-2 border-gray-300 rounded-md focus:border-primary focus:ring-2 focus:ring-primary-light"
                type="text"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
          ))}
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
