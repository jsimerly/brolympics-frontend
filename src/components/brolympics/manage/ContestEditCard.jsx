import { useState } from "react";
import { recordContest, unrecordContest } from "../../../api/client";
import { useNotification } from "../../Util/Notification";

/** Admin score correction for one contest, any kind. A completed contest is
 * unrecorded then re-recorded; the backend refuses when anything downstream
 * (bracket round, swiss pairing, closed stage) already consumed the result. */
const ContestEditCard = ({ contest, onSaved }) => {
  const { showNotification } = useNotification();
  const [saving, setSaving] = useState(false);
  const entries = contest.entries || [];
  const teamEntries = entries.filter((e) => e.team && !e.player);
  const playerEntries = entries.filter((e) => e.player);

  const [values, setValues] = useState(() => {
    const v = {};
    if (contest.kind === "match") {
      teamEntries.forEach((e) => (v[e.team] = e.score ?? ""));
    } else if (contest.kind === "outing") {
      playerEntries.forEach((e) => (v[e.player] = e.score ?? ""));
      v.team_score = teamEntries[0]?.score ?? "";
    } else {
      playerEntries.forEach((e) => (v[e.player] = e.placement ?? ""));
    }
    return v;
  });

  const setValue = (key) => (e) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const isIndOuting = contest.kind === "outing" && contest.format === "ind";
  const editable =
    contest.kind === "match"
      ? teamEntries.length >= 2
      : contest.kind === "outing"
      ? isIndOuting
        ? playerEntries.length > 0
        : teamEntries.length > 0
      : playerEntries.length > 0;

  const buildPayload = () => {
    if (contest.kind === "match") {
      return {
        scores: Object.fromEntries(
          teamEntries.map((e) => [e.team, Number(values[e.team])])
        ),
      };
    }
    if (contest.kind === "outing") {
      const payload = {};
      if (playerEntries.length) {
        payload.player_scores = Object.fromEntries(
          playerEntries.map((e) => [e.player, Number(values[e.player])])
        );
      }
      if (values.team_score !== "" && values.team_score != null) {
        payload.team_score = Number(values.team_score);
      }
      return payload;
    }
    return {
      placements: Object.fromEntries(
        playerEntries.map((e) => [e.player, Number(values[e.player])])
      ),
    };
  };

  const handleUpdateClicked = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (contest.is_complete) {
        await unrecordContest(contest.uuid);
      }
      await recordContest(contest.uuid, buildPayload());
      showNotification("This game has been updated.", "!border-primary");
      onSaved?.();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an error updating this game."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!editable) {
    return (
      <div className="p-3 text-xs bg-white border border-gray-200 rounded-lg text-light">
        {contest.kind === "match"
          ? "Waiting on earlier results to fill this matchup."
          : "Not recorded yet — scores are entered from the event-day screen."}
      </div>
    );
  }

  const rows =
    contest.kind === "match"
      ? teamEntries.map((e) => ({ key: e.team, label: e.team_name }))
      : contest.kind === "outing" && isIndOuting
      ? playerEntries.map((e) => ({ key: e.player, label: e.player_name }))
      : contest.kind === "outing"
      ? [{ key: "team_score", label: teamEntries[0]?.team_name }]
      : playerEntries.map((e) => ({
          key: e.player,
          label: e.player_name,
          suffix: "place",
        }));

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between pb-1">
        {contest.round != null && (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-light">
            Round {contest.round}
          </span>
        )}
        {!contest.is_complete && (
          <span className="text-[10px] text-light">not played yet</span>
        )}
      </div>
      <div className="flex flex-col divide-y divide-gray-50">
        {rows.map((row) => (
          <div
            className="flex items-center justify-between gap-3 py-1.5"
            key={row.key}
          >
            <span className="min-w-0 text-sm truncate">
              {row.label}
              {row.suffix && (
                <span className="text-[10px] text-light"> ({row.suffix})</span>
              )}
            </span>
            <input
              value={values[row.key] ?? ""}
              onChange={setValue(row.key)}
              className="w-16 shrink-0 input-box"
            />
          </div>
        ))}
        {contest.kind === "outing" && isIndOuting && (
          <div className="flex items-center justify-between gap-3 py-1.5">
            <span className="text-sm text-light">Team total (optional)</span>
            <input
              value={values.team_score ?? ""}
              onChange={setValue("team_score")}
              className="w-16 shrink-0 input-box"
            />
          </div>
        )}
      </div>
      <button
        className="w-full py-2 mt-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
        onClick={handleUpdateClicked}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Result"}
      </button>
    </div>
  );
};

export default ContestEditCard;
