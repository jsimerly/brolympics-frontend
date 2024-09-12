import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Bracket from "./Bracket";
import Comp_h2h from "./Competitions/Comp_h2h";
import Comp_ind from "./Competitions/Comp_ind.jsx";
import Comp_team from "./Competitions/Comp_team.jsx";
import { EventInfo } from "./EventInfo.jsx";

const EventActive = ({ events, eventInfo }) => {
  const { uuid, type, eventUuid } = useParams();
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(
    eventUuid || events[0]?.uuid || ""
  );
  const [showEventInfo, setShowEventInfo] = useState(false);

  useEffect(() => {
    if (!eventUuid && events[0]?.uuid) {
      const firstEvent = events[0];
      navigate(`/b/${uuid}/event/${firstEvent.type}/${firstEvent.uuid}`);
    }
  }, [eventUuid, events, navigate, uuid]);

  useEffect(() => {
    if (eventUuid) {
      setSelectedEventId(eventUuid);
    }
  }, [eventUuid]);

  const componentMap = {
    h2h: Comp_h2h,
    ind: Comp_ind,
    team: Comp_team,
  };

  const CompComp = componentMap[eventInfo?.type] || Comp_ind;

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 12) return "18px";
      if (name.length <= 16) return "16px";
      return "14px";
    }
  };

  const getDisplayInfo = (ranking) => {
    if (eventInfo?.type === "h2h") {
      return `${ranking.wins}-${ranking.losses} ${
        ranking.ties != 0 ? `${ranking.ties}` : ""
      }`;
    } else if (eventInfo?.type === "ind" || eventInfo?.type === "team") {
      return ranking.score;
    }
  };

  const handleEventInfoClick = () => {
    setShowEventInfo(true);
  };

  const handleCloseEventInfo = () => {
    setShowEventInfo(false);
  };

  if (!eventInfo) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="px-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="font-bold text-[20px] flex items-center">
            Standings
            {eventInfo.is_complete && (
              <span className="ml-2 pt-2 text-secondary text-[10px] flex items-center gap-1">
                Final <TaskAltIcon sx={{ fontSize: 14 }} />
              </span>
            )}
          </h2>
          <button
            className="flex flex-col items-start justify-center"
            onClick={handleEventInfoClick}
          >
            <MenuBookOutlinedIcon sx={{ fontSize: 30 }} />
          </button>
        </div>
        <div className="">
          <table className="w-full border">
            <thead>
              <tr className={`border ${eventInfo.is_complete && "font-bold"}`}>
                <th className="border w-[60px] p-2">
                  <NumbersOutlinedIcon />
                </th>
                <th className="pl-3 border text-start text-[20px]">Team</th>
                <th className="border w-[80px]">
                  <DiamondOutlinedIcon />
                </th>
              </tr>
            </thead>
            <tbody>
              {eventInfo.standings &&
                eventInfo.standings
                  .sort((a, b) => a.rank - b.rank)
                  .map((ranking, i) => (
                    <tr key={i + "_row"}>
                      <td className="p-3 font-semibold text-center text-[18px] border-r">
                        {ranking.rank}
                      </td>
                      <td className="pl-3 text-start text-[20px] border-r">
                        <div className="flex items-center gap-2">
                          <img
                            src={ranking.team.img}
                            className="w-[30px] h-[30px] rounded-md"
                            alt={ranking.team.name}
                          />
                          <div className="flex flex-col justify-center">
                            <span
                              className={`text-[${getFontSize(
                                ranking.team.name
                              )}] leading-5`}
                            >
                              {ranking.team.name}
                            </span>
                            <span className="text-[10px]">
                              {getDisplayInfo(ranking)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center border-r text-[18px]">
                        {Number.isInteger(ranking?.points)
                          ? ranking.points
                          : ranking.points.toFixed(1)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="py-3">
        {eventInfo.type === "h2h" && <Bracket {...eventInfo.bracket} />}
      </div>
      {eventInfo.competitions && (
        <div className="pb-6">
          <h2 className="font-bold text-[20px] px-6">Competitions</h2>
          <div className="space-y-2">
            {eventInfo.competitions.map((comp, i) => (
              <div key={i + "_events"}>
                {i !== 0 && (
                  <div className="w-full px-6">
                    <div className="w-full h-[1px]" />
                  </div>
                )}
                <CompComp {...comp} key={i} />
              </div>
            ))}
          </div>
        </div>
      )}
      {showEventInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EventInfo event={eventInfo} />
            <button
              onClick={handleCloseEventInfo}
              className="px-4 py-2 mt-4 text-white rounded bg-secondary hover:bg-secondary-dark"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventActive;
