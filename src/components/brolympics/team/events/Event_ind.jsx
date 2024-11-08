import EventWrapper from "./EventWrapper";

const Competition = ({
  player_1_name,
  player_1_score,
  player_2_name,
  player_2_score,
  team_score,
  is_active,
  rank,
  team,
}) => {
  return (
    <div
      className={`flex items-center px-3 py-2 border rounded-md 
      ${is_active && "border-[3px]"} ${
        !is_active && rank <= 4 ? "border-tertiary" : null
      }
      `}
    >
      <div className="grid grid-cols-2 ">
        <div className="text-end">
          {team.player_1?.short_name || "Player 1"}:
        </div>
        <div className="pl-3">{player_1_score}</div>
        <div className="text-end">
          {team.player_2?.short_name || "Player 2"}:
        </div>
        <div className="pl-3">{player_2_score}</div>
        <div className="font-bold text-end">Team:</div>
        <div className="pl-3 font-bold">{team_score}</div>
      </div>
    </div>
  );
};

const EventDropdown_Ind = ({ comps, decimcal_places, is_active, rank }) => (
  <div className={`pb-2 border-t`}>
    <h4 className="pt-2 font-bold">Competitions</h4>
    <div className="flex flex-col gap-1 py-1">
      {comps.map((comp, i) => (
        <Competition {...comp} rank={rank} key={i + "_ind_competition"} />
      ))}
      {comps.length === 0 && "Event has not started yet."}
    </div>
  </div>
);

const Event_ind = ({
  name,
  rank,
  points,
  is_active,
  is_final,
  score,
  decimal_places,
  comps,
  team,
}) => {
  const display_score =
    score !== null && score !== 0 ? score.toFixed(decimal_places) : "";

  return (
    <EventWrapper
      name={name}
      rank={rank}
      points={points}
      display_score={display_score}
      is_active={is_active}
      is_final={is_final}
    >
      <EventDropdown_Ind
        comps={comps}
        decimcal_places={decimal_places}
        is_active={is_active}
        rank={rank}
        team={team}
      />
    </EventWrapper>
  );
};

export default Event_ind;
