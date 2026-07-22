import React from "react";
import Img from "../../Util/Img";

/** One side of a match: winner reads bold with the score in blue, the loser
 * fades. Unplayed sides stay neutral. */
const TeamRow = ({ entry, decided }) => {
  const isWinner = decided && entry?.outcome === "w";
  const isLoser = decided && entry?.outcome === "l";
  return (
    <div
      className={`flex items-center gap-2 px-2 h-[38px] ${
        isLoser ? "opacity-50" : ""
      }`}
    >
      <Img
        src={entry?.team_img}
        alt={entry?.team_name}
        kind="team"
        className="object-cover w-6 h-6 rounded shrink-0"
      />
      {entry?.seed != null && (
        <span
          className={`w-3 text-[10px] text-center shrink-0 ${
            isWinner ? "font-semibold text-near-black" : "text-light"
          }`}
        >
          {entry.seed}
        </span>
      )}
      <span
        className={`flex-grow min-w-0 text-sm truncate ${
          isWinner ? "font-semibold" : ""
        }`}
      >
        {entry?.team_name || "TBD"}
      </span>
      <span
        className={`px-1 text-sm shrink-0 ${
          isWinner ? "font-bold text-primary" : "text-light"
        }`}
      >
        {entry?.score ?? (isWinner ? "W" : "")}
      </span>
    </div>
  );
};

const BracketNode = ({ contest }) => {
  if (!contest) return null;
  const [entry_1, entry_2] = contest.entries || [];
  // a completed "match" with a single winning entry is a bye, not a TBD
  const isBye =
    contest.is_complete &&
    (contest.entries || []).length === 1 &&
    entry_1?.outcome === "w";
  return (
    <div className="w-[210px] min-w-[210px] overflow-hidden bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
      <TeamRow entry={entry_1} decided={contest.is_complete && !isBye} />
      {isBye ? (
        <div className="h-[38px] flex items-center justify-center text-[10px] font-semibold tracking-widest uppercase text-light bg-gray-50/50">
          Bye
        </div>
      ) : (
        <TeamRow entry={entry_2} decided={contest.is_complete} />
      )}
    </div>
  );
};
export default BracketNode;
