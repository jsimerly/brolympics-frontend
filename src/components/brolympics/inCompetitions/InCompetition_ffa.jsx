import { useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { recordContest, abandonContest } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

const PLACE_STYLE = {
  1: "bg-secondary/20 text-secondary-dark",
  2: "bg-gray-200 text-gray-600",
  3: "bg-orange-100 text-orange-700",
};

/** The heat scorecard: tap racers in the order they finished. First tap is
 * 1st, the last racer fills in on their own, and tapping a placed racer
 * un-places them (everyone after shifts up). Taps, not drags -- dragging
 * fights the scroll. */
const InCompetition_ffa = ({ contest }) => {
  const [order, setOrder] = useState([]); // player uuids, finish order
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  const racers = contest.entries.filter((e) => e.player);
  const placeOf = (uuid) => {
    const i = order.indexOf(uuid);
    return i === -1 ? null : i + 1;
  };

  const tapRacer = (uuid) => {
    setOrder((prev) => {
      if (prev.includes(uuid)) return prev.filter((p) => p !== uuid);
      const next = [...prev, uuid];
      // everyone else is placed -- the last racer's spot is decided anyway
      if (next.length === racers.length - 1) {
        const last = racers.find((r) => !next.includes(r.player));
        if (last) next.push(last.player);
      }
      return next;
    });
  };

  const done = order.length === racers.length;

  const handleSubmitClicked = async () => {
    if (!done) {
      showNotification(
        "Tap every racer in the order they finished.",
        "warning"
      );
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      await recordContest(contest.uuid, {
        placements: Object.fromEntries(order.map((uuid, i) => [uuid, i + 1])),
      });
      showNotification("Heat recorded successfully", "success");
      window.location.reload();
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "Error recording the heat"),
        error.response?.status === 400 ? "warning" : "error"
      );
      setSaving(false);
    }
  };

  const handleCancelClicked = async () => {
    try {
      await abandonContest(contest.uuid);
      window.location.reload();
    } catch (error) {
      showNotification("Error backing out of the heat", "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-240px)] flex flex-col justify-between max-w-md mx-auto p-2">
      <div>
        <h2 className="pb-1 text-lg font-bold text-center">
          {contest.event_name}
        </h2>
        <p className="pb-3 text-xs text-center text-light">
          Tap racers in the order they finished — first tap takes 1st.
        </p>
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y divide-gray-50">
          {racers.map((entry) => {
            const place = placeOf(entry.player);
            return (
              <button
                className="flex items-center w-full gap-3 p-4 text-left"
                onClick={() => tapRacer(entry.player)}
                key={entry.player}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full shrink-0 ${
                    place
                      ? PLACE_STYLE[place] || "bg-primary/10 text-primary"
                      : "border-2 border-dashed border-gray-300 text-transparent"
                  }`}
                >
                  {place || "•"}
                </span>
                <div className="flex flex-col flex-grow min-w-0">
                  <span
                    className={`leading-tight truncate ${
                      place ? "font-semibold" : ""
                    }`}
                  >
                    {entry.player_name}
                  </span>
                  {entry.team_name && (
                    <span className="text-[11px] text-light truncate">
                      {entry.team_name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {order.length > 0 && (
          <button
            className="flex items-center gap-1 pt-2 mx-auto text-xs font-semibold text-light"
            onClick={() => setOrder([])}
          >
            <ReplayIcon sx={{ fontSize: 14 }} /> Start over
          </button>
        )}
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
          {saving ? "Saving..." : "Submit Placements"}
        </button>
      </div>
    </div>
  );
};

export default InCompetition_ffa;
