import TeamsBlock from "./TeamBlock";

const ActiveCompetition_h2h = ({ event_name, entries = [] }) => {
  const [entry_1, entry_2] = entries;
  const is_bracket = entry_1?.seed != null;

  return (
    <div className="p-2">
      <TeamsBlock
        name={event_name}
        team_1_name={entry_1?.team_name}
        team_1_img={entry_1?.team_img}
        team_1_seed={entry_1?.seed}
        team_2_name={entry_2?.team_name}
        team_2_img={entry_2?.team_img}
        team_2_seed={entry_2?.seed}
        is_bracket={is_bracket}
      />
    </div>
  );
};

export default ActiveCompetition_h2h;
