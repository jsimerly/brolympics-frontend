import EventWrapper from "./EventWrapper";

const Matchup = ({ contest, teamUuid }) => {
  const [entry_1, entry_2] = contest.entries || [];

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 16) {
        return "16px";
      } else if (name.length <= 20) {
        return "14px";
      } else {
        return "12px";
      }
    }
  };

  const textFor = (entry) => {
    if (entry?.team !== teamUuid || !contest.is_complete) return "";
    if (entry.outcome === "w") return "text-tertiary font-semibold";
    if (entry.outcome === "l") return "text-red";
    return "";
  };

  return (
    <div
      className={`flex items-center justify-center px-1
                ${contest.is_active && "border rounded-md"}
            `}
    >
      <div className="flex items-center justify-center w-full">
        <div
          className={`w-2/5 ${textFor(entry_1)}`}
          style={{ fontSize: getFontSize(entry_1?.team_name) }}
        >
          {entry_1?.team_name || "TBD"}
        </div>
        <div className="flex items-center justify-center w-1/5 text-center">
          <span className={`${textFor(entry_1)} w-2/3`}>{entry_1?.score}</span>
          <span className="w-1/5">:</span>
          <span className={`${textFor(entry_2)} w-2/3`}>{entry_2?.score}</span>
        </div>
        <div
          className={` ${textFor(entry_2)} w-2/5 text-end`}
          style={{ fontSize: getFontSize(entry_2?.team_name) }}
        >
          {entry_2?.team_name || "TBD"}
        </div>
      </div>
    </div>
  );
};

const EventDropdown_H2h = ({ stats, contests, teamUuid }) => (
  <div className={`py-2 border-t`}>
    <div className="flex justify-between">
      <div className="w-1/2">
        <h3 className="font-semibold">Margin</h3>
        <div className="grid grid-cols-2">
          <div>PF</div>
          <div>{stats.score_for ?? "—"} pts</div>
          <div>PA</div>
          <div>{stats.score_against ?? "—"} pts</div>
        </div>
      </div>
      {(stats.sov != null || stats.sos != null) && (
        <div className="w-1/2">
          <h3 className="font-semibold">Strength</h3>
          <div className="grid grid-cols-2">
            <div>SOV</div>
            <div>{stats.sov}</div>
            <div>SOS</div>
            <div>{stats.sos}</div>
          </div>
        </div>
      )}
    </div>
    <h4 className="pt-2 font-semibold">Competitions</h4>
    <div className="flex flex-col gap-1 py-1">
      {contests.map((contest) => (
        <Matchup contest={contest} teamUuid={teamUuid} key={contest.uuid} />
      ))}
      {contests.length === 0 && "Event has not started yet."}
    </div>
  </div>
);

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
      display_score={
        stats.wins != null ? `${stats.wins}-${stats.losses}` : ""
      }
      is_active={is_active}
      is_final={is_final}
    >
      <EventDropdown_H2h stats={stats} contests={contests} teamUuid={teamUuid} />
    </EventWrapper>
  );
};

export default Event_h2h;
