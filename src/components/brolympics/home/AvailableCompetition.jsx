import { useNavigate, useParams } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { startContest } from "../../../api/client";
import TeamsBlock from "./TeamBlock";
import Img from "../../Util/Img";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

/** One card for any waiting contest. Matches (h2h) show both sides; outings
 * show the checking-in team; heats show the field of racers. When the event's
 * stations are all in use the start button doesn't render at all -- the
 * check-in 400 only ever reaches a stale browser. */
const AvailableCompetition = ({
  event_name,
  entries = [],
  uuid,
  format,
  stations_full,
}) => {
  const navigate = useNavigate();
  const { uuid: broUuid } = useParams();
  const { showNotification } = useNotification();

  const teamEntries = entries.filter((e) => e.team && !e.player);
  const racers = entries.filter((e) => e.player);
  const isMatch = format === "h2h" && teamEntries.length >= 2;
  const isHeat = format === "ffa" && racers.length > 0;
  const [entry_1, entry_2] = teamEntries;
  const is_bracket = entry_1?.seed != null;

  const onStartClicked = async () => {
    try {
      await startContest(uuid);
      navigate(`/b/${broUuid}/competition/${uuid}`);
    } catch (error) {
      // stale browser: the board filled up after this page rendered
      showNotification(
        apiErrorMessage(error, "Unable to start this game."),
        "border-yellow-500"
      );
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
      {stations_full ? (
        <div className="flex items-center justify-center w-full gap-1 py-2.5 mt-3 text-sm font-semibold rounded-full bg-gray-50 text-light">
          <HourglassEmptyIcon sx={{ fontSize: 16 }} /> All stations busy — up
          when one frees
        </div>
      ) : (
        <button
          className="flex items-center justify-center w-full gap-1 py-2.5 mt-3 font-semibold text-white rounded-full bg-primary"
          onClick={onStartClicked}
        >
          <PlayArrowIcon sx={{ fontSize: 20 }} /> Start Game
        </button>
      )}
    </div>
  );
};

export default AvailableCompetition;
