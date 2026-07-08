import TeamsBlock from "./TeamBlock";
import Img from "../../Util/Img";

/** One card for any in-progress contest. Matches show both sides; outings
 * show the playing team. */
const ActiveCompetition = ({ event_name, entries = [], format }) => {
  const teamEntries = entries.filter((e) => e.team && !e.player);
  const isMatch = format === "h2h" && teamEntries.length >= 2;
  const [entry_1, entry_2] = teamEntries;
  const is_bracket = entry_1?.seed != null;

  if (isMatch) {
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
  }

  return (
    <div className="p-2">
      <h2 className="pb-2 font-bold">{event_name}</h2>
      <div className="flex gap-2">
        <Img
          src={entry_1?.team_img}
          className="h-[60px] w-[60px] min-w-[60px] bg-white rounded-md"
        />
        <div className="flex items-center font-bold">{entry_1?.team_name}</div>
      </div>
    </div>
  );
};

export default ActiveCompetition;
