import EventWrapper from "./EventWrapper";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

/** One game, game-log style: colored result letter, score, opponent. */
const Matchup = ({ contest, teamUuid }) => {
  const mine = (contest.entries || []).find((e) => e.team === teamUuid);
  const opp = (contest.entries || []).find((e) => e.team !== teamUuid);
  if (!mine) return null;
  const result = mine.outcome === "w" ? "W" : mine.outcome === "t" ? "T" : "L";
  const color =
    mine.outcome === "w"
      ? "text-tertiary"
      : mine.outcome === "l"
      ? "text-red"
      : "text-light";

  return (
    <div className="flex items-center gap-2 py-1.5 text-sm border-t first:border-t-0">
      {contest.is_complete ? (
        <span className={`w-5 font-bold ${color}`}>{result}</span>
      ) : (
        <span className="w-5 text-light">–</span>
      )}
      <span className="flex-grow">
        {contest.is_complete && mine.score != null
          ? `${mine.score ?? "—"}–${opp?.score ?? "—"} `
          : ""}
        vs {opp?.team_name ?? "TBD"}
      </span>
      {contest.stage_structure === "knockout" && (
        <AccountTreeOutlinedIcon
          sx={{ fontSize: 14 }}
          className="text-primary"
          titleAccess="Playoff game"
        />
      )}
      {contest.is_active && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
          live
        </span>
      )}
    </div>
  );
};

const Event_h2h = ({
  name,
  rank,
  points,
  is_final,
  is_active,
  stats = {},
  contests = [],
  teamUuid,
}) => {
  return (
    <EventWrapper
      name={name}
      rank={rank}
      points={points}
      display_score={stats.wins != null ? `${stats.wins}-${stats.losses}` : ""}
      is_active={is_active}
      is_final={is_final}
    >
      <div className="pb-2">
        {(stats.score_for != null || stats.sov != null) && (
          <div className="flex gap-2 pb-2 text-xs text-light">
            {stats.score_for != null && (
              <span className="px-2 py-1 bg-white border rounded-full">
                PF {stats.score_for} · PA {stats.score_against}
              </span>
            )}
            {stats.sov != null && (
              <span className="px-2 py-1 bg-white border rounded-full">
                SOV {stats.sov} · SOS {stats.sos}
              </span>
            )}
          </div>
        )}
        <div className="px-3 bg-white border rounded-lg">
          {contests.map((contest) => (
            <Matchup contest={contest} teamUuid={teamUuid} key={contest.uuid} />
          ))}
          {contests.length === 0 && (
            <p className="py-2 text-sm text-light">Event has not started yet.</p>
          )}
        </div>
      </div>
    </EventWrapper>
  );
};

export default Event_h2h;
