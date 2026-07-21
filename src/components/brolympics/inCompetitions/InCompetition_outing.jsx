import { useState, useEffect } from "react";
import { recordContest, abandonContest, fetchTeam } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import Img from "../../Util/Img";
import { isScoreInput } from "../../Util/format";

/** Score entry for outing contests: one input per active roster player for
 * ind events (dormant players sit out), a single team input for team events.
 * Decimals welcome -- lap times are scores too. */
const InCompetition_outing = ({ contest }) => {
  const isInd = contest.format === "ind";
  const [scores, setScores] = useState({});
  const [teamScore, setTeamScore] = useState("");
  const [team, setTeam] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  const teamEntry =
    contest.entries.find((e) => e.team && !e.player) || contest.entries[0];

  useEffect(() => {
    if (!isInd) return;
    const getTeam = async () => {
      try {
        setTeam(await fetchTeam(teamEntry.team));
      } catch (error) {
        console.error("Error fetching team:", error);
        showNotification("Error loading the game", "border-red-500");
      }
    };
    getTeam();
  }, [teamEntry.team, isInd]);

  const roster = (team?.players || []).filter((p) => p.is_active !== false);

  const numericChange = (setter) => (e) => {
    const value = e.target.value;
    if (isScoreInput(value)) {
      setter(value);
    }
  };

  const handleScoreChange = (playerUuid) =>
    numericChange((value) =>
      setScores((prev) => ({ ...prev, [playerUuid]: value }))
    );

  const handleSubmitClicked = async () => {
    if (saving) return;
    try {
      if (isInd) {
        if (roster.some((p) => !scores[p.uuid]?.length)) {
          showNotification(
            "Enter a score for every player.",
            "border-yellow-500"
          );
          return;
        }
        setSaving(true);
        await recordContest(contest.uuid, {
          player_scores: Object.fromEntries(
            roster.map((p) => [p.uuid, Number(scores[p.uuid])])
          ),
        });
      } else {
        if (teamScore === "") {
          showNotification("Enter a score.", "border-yellow-500");
          return;
        }
        setSaving(true);
        await recordContest(contest.uuid, { team_score: Number(teamScore) });
      }
      showNotification("Scores submitted successfully", "border-primary");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting scores:", error);
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "Error submitting scores",
        "border-red-500"
      );
      setSaving(false);
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling competition:", error);
      showNotification("Error backing out of the game", "border-red-500");
    }
  };

  if (isInd && !team) {
    return <div className="p-6 text-center text-light">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-240px)] flex flex-col justify-between max-w-md mx-auto p-2">
      <div>
        <h2 className="pb-3 text-lg font-bold text-center">
          {contest.event_name}
        </h2>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Img
              src={isInd ? team.img : teamEntry?.team_img}
              alt="team logo"
              className="object-cover rounded-lg w-14 h-14 shrink-0"
            />
            <h3 className="text-xl font-semibold truncate">
              {isInd ? team.name : teamEntry?.team_name}
            </h3>
          </div>
          {isInd ? (
            <div className="divide-y divide-gray-50">
              {roster.map((player) => (
                <div
                  key={player.uuid}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0 text-sm font-medium truncate">
                    {player.name}
                  </span>
                  <input
                    value={scores[player.uuid] || ""}
                    onChange={handleScoreChange(player.uuid)}
                    className="w-20 h-12 text-lg font-semibold shrink-0 input-box"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-3">
              <span className="text-sm font-medium">Team score</span>
              <input
                value={teamScore}
                onChange={numericChange(setTeamScore)}
                className="w-24 text-xl font-semibold h-14 shrink-0 input-box"
                type="text"
                inputMode="decimal"
                placeholder="0"
              />
            </div>
          )}
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

export default InCompetition_outing;
