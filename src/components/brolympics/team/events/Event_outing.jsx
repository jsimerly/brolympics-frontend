import EventWrapper from "./EventWrapper";
import { trimFloat } from "../../../Util/format";

/** One outing, game-log style: the score up front, player breakdown after. */
const Outing = ({ contest }) => {
  const entries = contest.entries || [];
  const teamEntry = entries.find((e) => e.team && !e.player) || entries[0];
  const playerEntries = entries.filter((e) => e.player);
  const total =
    teamEntry?.score ??
    (playerEntries.length
      ? playerEntries.reduce((sum, e) => sum + (e.score ?? 0), 0)
      : null);

  return (
    <div className="flex items-start gap-2 py-1.5 text-sm border-t first:border-t-0">
      <span className="w-10 font-bold shrink-0">
        {contest.is_complete && total != null ? trimFloat(total) : "–"}
      </span>
      <span className="flex flex-col flex-grow min-w-0 text-light">
        {playerEntries.length > 0 ? (
          playerEntries.map((e) => (
            <span className="flex justify-between gap-2" key={e.player}>
              <span className="truncate">{e.player_name}</span>
              <span className="shrink-0">{e.score ?? "—"}</span>
            </span>
          ))
        ) : (
          <span>{contest.is_complete ? "team score" : "not played yet"}</span>
        )}
      </span>
      {contest.is_active && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
          live
        </span>
      )}
    </div>
  );
};

const Event_outing = ({
  name,
  rank,
  points,
  is_active,
  is_final,
  stats = {},
  contests = [],
}) => {
  const display_score =
    stats.total != null && stats.total !== 0
      ? `Score: ${trimFloat(Number(stats.total))}`
      : "";

  return (
    <EventWrapper
      name={name}
      rank={rank}
      points={points}
      display_score={display_score}
      is_active={is_active}
      is_final={is_final}
    >
      <div className="pb-2">
        <div className="px-3 bg-white border rounded-lg">
          {contests.map((contest) => (
            <Outing contest={contest} key={contest.uuid} />
          ))}
          {contests.length === 0 && (
            <p className="py-2 text-sm text-light">Event has not started yet.</p>
          )}
        </div>
      </div>
    </EventWrapper>
  );
};

export default Event_outing;
