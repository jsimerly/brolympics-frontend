import { useNavigate, useParams } from "react-router-dom";
import TeamsBlock from "./TeamBlock";
import Img from "../../Util/Img";

/** One card for any in-progress contest. Matches show both sides; outings
 * show the playing team; heats show the field of racers. Tapping reopens the
 * scorecard -- checking in and pocketing your phone can't strand a game. */
const ActiveCompetition = ({ event_name, entries = [], uuid, format }) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();
  const teamEntries = entries.filter((e) => e.team && !e.player);
  const racers = entries.filter((e) => e.player);
  const isMatch = format === "h2h" && teamEntries.length >= 2;
  const isHeat = format === "ffa" && racers.length > 0;
  const [entry_1, entry_2] = teamEntries;
  const is_bracket = entry_1?.seed != null;

  return (
    <div
      className="p-4 bg-white border rounded-lg cursor-pointer border-tertiary/40"
      onClick={() => navigate(`/b/${broUuid}/competition/${uuid}`)}>
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-semibold tracking-wide uppercase text-light">
          {event_name}
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-tertiary/10 text-tertiary-dark">
          live
        </span>
      </div>
      {isMatch ? (
        <TeamsBlock
          team_1_name={entry_1?.team_name}
          team_1_img={entry_1?.team_img}
          team_1_seed={entry_1?.seed}
          team_2_name={entry_2?.team_name}
          team_2_img={entry_2?.team_img}
          team_2_seed={entry_2?.seed}
          is_bracket={is_bracket}
        />
      ) : isHeat ? (
        <div className="flex flex-wrap gap-1.5">
          {racers.map((entry) => (
            <span
              className="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-near-black"
              key={entry.player}
            >
              {entry.player_name}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Img
            src={entry_1?.team_img}
            alt={entry_1?.team_name}
            className="object-cover w-12 h-12 rounded-lg shrink-0"
          />
          <span className="text-sm font-semibold">{entry_1?.team_name}</span>
        </div>
      )}
    </div>
  );
};

export default ActiveCompetition;
