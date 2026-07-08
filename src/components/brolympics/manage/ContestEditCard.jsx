import { useState } from "react";
import { recordContest, unrecordContest } from "../../../api/client";
import { useNotification } from "../../Util/Notification";

/** Admin score correction for one contest, any kind. A completed contest is
 * unrecorded then re-recorded; the backend refuses when anything downstream
 * (bracket round, swiss pairing, closed stage) already consumed the result. */
const ContestEditCard = ({ contest, onSaved }) => {
  const { showNotification } = useNotification();
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
    try {
      if (contest.is_complete) {
        await unrecordContest(contest.uuid);
      }
      await recordContest(contest.uuid, buildPayload());
      showNotification("This competition has been updated.", "!border-primary");
      onSaved?.();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an error when attemping to update this competition."
      );
    }
  };

  if (!editable) {
    return (
      <div className="p-2 text-[12px] border rounded-md">
        {contest.kind === "match"
          ? "Waiting on earlier results to fill this matchup."
          : "This competition has not been recorded yet. Scores are entered from the event-day screen."}
      </div>
    );
  }

  const rows =
    contest.kind === "match"
      ? teamEntries.map((e) => ({
          key: e.team,
          label: e.team_name,
        }))
      : contest.kind === "outing" && isIndOuting
      ? playerEntries.map((e) => ({ key: e.player, label: e.player_name }))
      : contest.kind === "outing"
      ? [{ key: "team_score", label: teamEntries[0]?.team_name }]
      : playerEntries.map((e) => ({
          key: e.player,
          label: `${e.player_name} (place)`,
        }));

  return (
    <div className="relative flex flex-col gap-1 p-2 border rounded-md">
      {contest.round != null && (
        <span className="text-[10px]">Round {contest.round}</span>
      )}
      {rows.map((row) => (
        <div className="flex items-center" key={row.key}>
          <div>{row.label}:</div>
          <input
            value={values[row.key] ?? ""}
            onChange={setValue(row.key)}
            className="p-2 rounded-md w-[60px] border ml-1"
          />
        </div>
      ))}
      {contest.kind === "outing" && isIndOuting && (
        <div className="flex items-center">
          <div className="font-semibold">Team (optional):</div>
          <input
            value={values.team_score ?? ""}
            onChange={setValue("team_score")}
            className="p-2 rounded-md w-[60px] border ml-1"
          />
        </div>
      )}
      <button
        className="absolute px-2 py-1 rounded-md bottom-2 right-2 bg-primary"
        onClick={handleUpdateClicked}
      >
        Update
      </button>
    </div>
  );
};

export default ContestEditCard;
