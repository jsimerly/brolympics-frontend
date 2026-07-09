import { useState } from "react";
import { confirmContest } from "../../../../api/client";
import Img from "../../../Util/Img";

/** One h2h game as a scoreboard row: flag + name each side, score in the
 * middle, winner emphasized. Unconfirmed self-reports carry their badge and
 * (for the other side) a confirm button. */
const Comp_h2h = ({
  entries = [],
  is_complete,
  is_active,
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

  // winner-known-but-score-unknown games show W/L letters, ties show T
  const scoreOf = (entry) =>
    entry?.score ?? ({ w: "W", l: "L", t: "T" }[entry?.outcome] || "–");
  const nameClass = (entry) =>
    `text-sm truncate ${
      entry?.outcome === "w"
        ? "font-semibold"
        : is_complete
        ? "text-light"
        : ""
    }`;
  const scoreClass = (entry) =>
    entry?.outcome === "w" ? "" : "text-light";

  return (
    <div className="px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 min-w-0 gap-2">
          <Img
            src={entry_1?.team_img}
            alt={entry_1?.team_name}
            className="object-cover w-6 h-6 rounded shrink-0"
          />
          <span className={nameClass(entry_1)}>
            {entry_1?.team_name || "TBD"}
          </span>
        </div>

        <div className="px-1 text-sm font-semibold text-center shrink-0 tabular-nums">
          {is_complete ? (
            <>
              <span className={scoreClass(entry_1)}>{scoreOf(entry_1)}</span>
              <span className="px-1 font-normal text-light">:</span>
              <span className={scoreClass(entry_2)}>{scoreOf(entry_2)}</span>
            </>
          ) : is_active ? (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
              live
            </span>
          ) : (
            <span className="text-xs font-normal text-light">vs</span>
          )}
        </div>

        <div className="flex items-center justify-end flex-1 min-w-0 gap-2">
          <span className={`${nameClass(entry_2)} text-right`}>
            {entry_2?.team_name || "TBD"}
          </span>
          <Img
            src={entry_2?.team_img}
            alt={entry_2?.team_name}
            className="object-cover w-6 h-6 rounded shrink-0"
          />
        </div>
      </div>

      {needs_confirmation && (
        <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-light">
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
