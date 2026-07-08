import React from "react";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Bracket from "./Bracket";
import Comp_h2h from "./Competitions/Comp_h2h";
import Comp_outing from "./Competitions/Comp_outing.jsx";
import { EventInfo } from "./EventInfo.jsx";

const EventActive = ({ eventInfo }) => {
  const CompComp = eventInfo?.type === "h2h" ? Comp_h2h : Comp_outing;

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 12) return "18px";
      if (name.length <= 16) return "16px";
      return "14px";
    }
  };

  const getDisplayInfo = (row) => {
    const stats = row.stats || {};
    if (eventInfo?.type === "h2h") {
      if (stats.wins == null) return "";
      return `${stats.wins}-${stats.losses}${
        stats.ties ? `-${stats.ties}` : ""
      }`;
    }
    return stats.total ?? stats.placement_points ?? "";
  };

  const displayPoints = (points) => {
    if (points == null) return "—";
    return Number.isInteger(points) ? points : points.toFixed(1);
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
                eventInfo.standings.map((row, i) => (
                  <tr key={i + "_row"}>
                    <td className="p-3 font-semibold text-center text-[18px] border-r">
                      {row.rank}
                    </td>
                    <td className="pl-3 text-start text-[20px] border-r">
                      <div className="flex items-center gap-2">
                        <img
                          src={row.team.img}
                          className="w-[30px] h-[30px] rounded-md"
                          alt={row.team.name}
                        />
                        <div className="flex flex-col justify-center">
                          <span
                            className={`text-[${getFontSize(
                              row.team.name
                            )}] leading-5`}
                          >
                            {row.team.name}
                          </span>
                          <span className="text-[10px]">
                            {getDisplayInfo(row)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center border-r text-[18px]">
                      {displayPoints(row.points)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="py-3">
        {(eventInfo.brackets || []).map((bracket) => (
          <Bracket key={bracket.stage} {...bracket} />
        ))}
      </div>
      {eventInfo.contests && eventInfo.contests.length > 0 && (
        <div className="pb-6">
          <h2 className="font-bold text-[20px] px-6">Competitions</h2>
          <div className="space-y-2">
            {eventInfo.contests.map((contest, i) => (
              <div key={contest.uuid}>
                {i !== 0 && (
                  <div className="w-full px-6">
                    <div className="w-full h-[1px]" />
                  </div>
                )}
                <CompComp {...contest} />
              </div>
            ))}
          </div>
        </div>
      )}

      <EventInfo event={eventInfo} />
    </div>
  );
};

export default EventActive;
