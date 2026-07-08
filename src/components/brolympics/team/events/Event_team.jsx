import EventWrapper from "./EventWrapper";

const Competition = ({ contest, rank }) => {
  const entries = contest.entries || [];
  const teamEntry = entries.find((e) => e.team && !e.player) || entries[0];

  return (
    <div
      className={`flex items-center px-3 py-2 border rounded-md
       ${contest.is_active && "border-[3px]"} ${
        !contest.is_active && rank <= 4 ? "border-tertiary" : null
      }
      `}
    >
      <div className="grid grid-cols-2 ">
        <div className="font-bold text-end">Score:</div>
        <div className="pl-3 font-bold">
          {teamEntry?.score != null ? teamEntry.score : "—"}
        </div>
      </div>
    </div>
  );
};

const EventDropdown_Team = ({ contests, rank }) => (
  <div className={`pb-2 border-t  `}>
    <h4 className="pt-2 font-bold">Competitions</h4>
    <div className="flex flex-col gap-1 py-1">
      {contests.map((contest) => (
        <Competition contest={contest} rank={rank} key={contest.uuid} />
      ))}
      {contests.length === 0 && "Event has not started yet."}
    </div>
  </div>
);

const Event_team = ({
  name,
  rank,
  points,
  is_active,
  is_final,
  stats = {},
  contests = [],
}) => {
  const display_score =
    stats.total != null && stats.total !== 0 ? stats.total : "";
  return (
    <EventWrapper
      name={name}
      rank={rank}
      points={points}
      display_score={display_score}
      is_active={is_active}
      is_final={is_final}
    >
      <EventDropdown_Team contests={contests} rank={rank} />
    </EventWrapper>
  );
};

export default Event_team;
