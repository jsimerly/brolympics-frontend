import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <div className="card">
      <h2 className="p-2 mb-4 text-lg font-semibold text-center text-white bg-primary">
        {event_name}
      </h2>
      <div className="p-4">
        {isMatch ? (
          <TeamsBlock
            name={""}
            team_1_name={entry_1?.team_name}
            team_1_img={entry_1?.team_img}
            team_1_seed={entry_1?.seed}
            team_2_name={entry_2?.team_name}
            team_2_img={entry_2?.team_img}
            team_2_seed={entry_2?.seed}
            is_bracket={is_bracket}
          />
        ) : (
          <div className="flex items-center w-full">
            <div className="flex items-center space-x-4">
              <Img
                src={entry_1?.team_img}
                alt={`${entry_1?.team_name} logo`}
                className="object-cover w-16 h-16 rounded-md"
              />
              <div className="text-lg font-bold">{entry_1?.team_name}</div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <button
          className="w-full px-4 py-2 font-bold border rounded-md border-primary"
          onClick={onStartClicked}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default AvailableCompetition;
