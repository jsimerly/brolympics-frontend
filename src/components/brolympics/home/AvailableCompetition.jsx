import { useNavigate, useParams } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { startContest } from "../../../api/client";
import TeamsBlock from "./TeamBlock";
import Img from "../../Util/Img";

/** One card for any waiting contest. Matches (h2h) show both sides; outings
 * show the checking-in team. */
const AvailableCompetition = ({ event_name, entries = [], uuid, format }) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();

  const teamEntries = entries.filter((e) => e.team && !e.player);
  const isMatch = format === "h2h" && teamEntries.length >= 2;
  const [entry_1, entry_2] = teamEntries;
  const is_bracket = entry_1?.seed != null;

  const onStartClicked = async () => {
    try {
      await startContest(uuid);
      navigate(`/b/${broUuid}/competition/${uuid}`);
    } catch (error) {
      console.error("Error starting competition:", error);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <span className="text-xs font-semibold tracking-wide uppercase text-light">
        {event_name}
      </span>
      <div className="pt-2">
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
      <button
        className="flex items-center justify-center w-full gap-1 py-2.5 mt-3 font-semibold text-white rounded-full bg-primary"
        onClick={onStartClicked}
      >
        <PlayArrowIcon sx={{ fontSize: 20 }} /> Start Game
      </button>
    </div>
  );
};

export default AvailableCompetition;
