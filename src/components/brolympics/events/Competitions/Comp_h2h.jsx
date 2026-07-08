import { useState } from "react";
import { confirmContest } from "../../../../api/client";

const Comp_h2h = ({
  entries = [],
  is_complete,
  uuid,
  needs_confirmation,
  can_confirm,
  recorded_by_name,
}) => {
  const [entry_1, entry_2] = entries;
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await confirmContest(uuid);
      location.reload();
    } catch (error) {
      if (error.response?.status === 400) {
        // someone else confirmed first -- refresh shows it settled
        location.reload();
        return;
      }
      console.error("Error confirming result:", error);
      setBusy(false);
    }
  };

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 10) {
        return "16px";
      } else if (name.length <= 16) {
        return "14px";
      } else if (name.length <= 20) {
        return "12px";
      } else {
        return "10px";
      }
    }
  };

  const winStyle = (entry) =>
    entry?.outcome === "w" ? "font-bold text-primaryLight" : "";

  // winner-known-but-score-unknown games show W/L letters, ties show T
  const scoreOf = (entry) =>
    entry?.score ??
    ({ w: "W", l: "L", t: "T" }[entry?.outcome] || "—");

  return (
    <div className={`flex flex-col items-center justify-center py-3 px-4`}>
      <div className="flex items-center justify-center w-full">
        <div
          className={`w-2/5 ${winStyle(entry_1)}`}
          style={{ fontSize: getFontSize(entry_1?.team_name) }}
        >
          {entry_1?.team_name || "TBD"}
        </div>
        <div className="w-1/5 text-center">
          {is_complete ? (
            <>
              <span className={winStyle(entry_1)}>{scoreOf(entry_1)}</span>
              <span className="px-1">:</span>
              <span className={winStyle(entry_2)}>{scoreOf(entry_2)}</span>
            </>
          ) : (
            "vs"
          )}
        </div>
        <div
          className={`w-2/5 ${winStyle(entry_2)} text-end`}
          style={{ fontSize: getFontSize(entry_2?.team_name) }}
        >
          {entry_2?.team_name || "TBD"}
        </div>
      </div>
      {needs_confirmation && (
        <div className="flex items-center gap-2 pt-1 text-[10px] text-light">
          <span>unconfirmed — recorded by {recorded_by_name}</span>
          {can_confirm && (
            <button
              className="px-2 py-0.5 font-semibold border rounded-full text-tertiary border-tertiary disabled:opacity-50"
              onClick={confirm}
              disabled={busy}
            >
              {busy ? "..." : "Confirm"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comp_h2h;
