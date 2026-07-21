import { useState } from "react";
import { recordContest, abandonContest } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import Img from "../../Util/Img";
import { isScoreInput } from "../../Util/format";
import { apiErrorMessage } from "../../Util/apiError";

/** The h2h scorecard: both teams, two big score boxes, one loud submit. */
const InCompetitions_h2h = ({ contest }) => {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  const [entry_1, entry_2] = contest.entries;

  // decimals welcome -- lap times and golf scores are scores too
  const handleScoreChange = (setter) => (e) => {
    const value = e.target.value;
    if (isScoreInput(value)) {
      setter(value);
    }
  };

  const handleSubmitClicked = async () => {
    if (team1Score === "" || team2Score === "") {
      showNotification("Enter a score for both teams", "border-red-500");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await recordContest(contest.uuid, {
        scores: {
          [entry_1.team]: Number(team1Score),
          [entry_2.team]: Number(team2Score),
        },
      });
      showNotification("Game recorded successfully", "border-primary");
      window.location.reload();
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "Error recording the game"),
        error.response?.status === 400 ? "border-yellow-500" : "border-red-500"
      );
      setSaving(false);
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      window.location.reload();
    } catch (error) {
      showNotification("Error backing out of the game", "border-red-500");
    }
  };

  const rows = [
    [entry_1, team1Score, setTeam1Score],
    [entry_2, team2Score, setTeam2Score],
  ];

  return (
    <div className="min-h-[calc(100vh-240px)] flex flex-col justify-between max-w-md mx-auto p-2">
      <div>
        <h2 className="pb-3 text-lg font-bold text-center">
          {contest.event_name}
        </h2>
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
          {rows.map(([entry, score, setter], i) => (
            <div key={entry.team}>
              {i === 1 && (
                <div className="flex items-center gap-3 px-4">
                  <div className="flex-grow h-px bg-gray-100" />
                  <span className="text-xs font-semibold text-light">vs</span>
                  <div className="flex-grow h-px bg-gray-100" />
                </div>
              )}
              <div className="flex items-center gap-3 p-4">
                <Img
                  src={entry.team_img}
                  alt={entry.team_name}
                  className="object-cover rounded-lg w-14 h-14 shrink-0"
                />
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-semibold leading-tight truncate">
                    {entry.team_name}
                  </span>
                  {entry.seed != null && (
                    <span className="text-[11px] text-light">
                      #{entry.seed} seed
                    </span>
                  )}
                </div>
                <input
                  value={score}
                  onChange={handleScoreChange(setter)}
                  className="w-20 h-16 text-2xl font-bold shrink-0 input-box"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="w-1/3 py-3 font-semibold border rounded-full text-light border-gray-300"
          onClick={handleCancelClicked}
        >
          Back out
        </button>
        <button
          className="w-2/3 py-3 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
          onClick={handleSubmitClicked}
          disabled={saving}
        >
          {saving ? "Saving..." : "Submit Score"}
        </button>
      </div>
    </div>
  );
};

export default InCompetitions_h2h;
