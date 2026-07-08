import React from "react";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Bracket from "./Bracket";
import Img from "../../Util/Img";
import HeatManager from "./HeatManager.jsx";
import Comp_h2h from "./Competitions/Comp_h2h";
import Comp_outing from "./Competitions/Comp_outing.jsx";
import { EventInfo } from "./EventInfo.jsx";

const EventActive = ({ eventInfo, is_admin }) => {
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
          <h2 className="flex items-center header-3">
            Standings
            {eventInfo.is_complete && (
              <span className="ml-2 pt-2 text-secondary text-[10px] flex items-center gap-1">
                Final <TaskAltIcon sx={{ fontSize: 14 }} />
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-hidden card">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
                <th className="w-[60px] p-2">
                  <NumbersOutlinedIcon sx={{ fontSize: 20 }} />
                </th>
                <th className="pl-3 text-start">Team</th>
                <th className="w-[80px]">
                  <DiamondOutlinedIcon sx={{ fontSize: 20 }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {eventInfo.standings &&
                eventInfo.standings.map((row, i) => (
                  <tr
                    key={i + "_row"}
                    className={i % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-3 font-semibold text-center border-t">
                      {row.rank}
                    </td>
                    <td className="pl-3 border-t text-start">
                      <div className="flex items-center gap-2">
                        <Img
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
                    <td className="p-2 font-semibold text-center border-t">
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
      {eventInfo.type === "ffa" ? (
        <HeatManager event={eventInfo} is_admin={is_admin} />
      ) : (
        eventInfo.contests &&
        eventInfo.contests.length > 0 && (
          <div className="px-4 pb-6">
            <h2 className="mb-4 header-3">Competitions</h2>
            <div className="overflow-hidden card divide-y">
              {eventInfo.contests.map((contest) => (
                <CompComp {...contest} key={contest.uuid} />
              ))}
            </div>
          </div>
        )
      )}

      <EventInfo event={eventInfo} />
    </div>
  );
};

export default EventActive;
