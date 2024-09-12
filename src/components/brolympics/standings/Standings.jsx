import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchStandings } from "../../../api/activeBro/standings.js";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";

const Standings = ({ status, teams }) => {
  const { uuid } = useParams();
  const [standingData, setStandingData] = useState();

  useEffect(() => {
    const getStandingsInfo = async () => {
      try {
        const data = await fetchStandings(uuid);
        setStandingData(data);
      } catch (error) {
        console.error(error);
      }
    };
    getStandingsInfo();
  }, [uuid]);

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 12) return "text-xl";
      if (name.length <= 16) return "text-lg";
      if (name.length <= 20) return "text-base";
      return "text-sm";
    }
  };

  const renderScoringInfo = () => (
    <div className="p-4 mb-6 card">
      <h3 className="header-3 text-red">Scoring</h3>
      <p className="mb-4 text-light">
        Scoring in the top 3 will earn bonus points.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white bg-red">
              <th className="px-4 py-2 text-left">Place</th>
              <th className="px-4 py-2 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border-t border-gray-200">1st</td>
              <td className="px-4 py-2 border-t border-gray-200">
                3 + 2nd place points
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-t border-gray-200">2nd</td>
              <td className="px-4 py-2 border-t border-gray-200">
                2 + 3rd place points
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border-t border-gray-200">3rd</td>
              <td className="px-4 py-2 border-t border-gray-200">
                2 + 4th place points
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-t border-gray-200">
                4th and below
              </td>
              <td className="px-4 py-2 border-t border-gray-200">
                1 + previous place's points
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border-t border-gray-200">Last Place</td>
              <td className="px-4 py-2 border-t border-gray-200">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStandings = () => {
    let standingsData = standingData?.standings || [];

    if (standingsData.length === 0 && teams) {
      standingsData = teams.map((team) => ({
        rank: "-",
        total_points: 0,
        team: team,
      }));
    }

    return (
      <div className="p-4 overflow-hidden card">
        <h2 className="p-4 header-3">Overall Standings</h2>
        <table className="w-full">
          <thead>
            <tr className="text-white bg-red">
              <th className="p-2 w-[60px]">
                <NumbersOutlinedIcon />
              </th>
              <th className="p-2 text-left">Team</th>
              <th className="p-2 w-[80px]">
                <DiamondOutlinedIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {standingsData
              .sort((a, b) => a.rank - b.rank)
              .map((ranking, i) => (
                <tr
                  key={i + "_row"}
                  className={i % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="p-3 text-lg font-semibold text-center border-r">
                    {ranking.rank}
                  </td>
                  <td className="p-3 border-r">
                    <div className="flex items-center gap-2">
                      <img
                        src={ranking.team.img}
                        alt={ranking.team.name}
                        className="w-[30px] h-[30px] rounded-md"
                      />
                      <span
                        className={`${getFontSize(
                          ranking.team.name
                        )} font-medium`}
                      >
                        {ranking.team?.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-lg font-semibold text-center">
                    {Number.isInteger(ranking?.total_points)
                      ? ranking.total_points
                      : ranking.total_points.toFixed(1)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPodiums = () =>
    standingData?.podiums &&
    standingData.podiums.length > 0 && (
      <div className="mt-6">
        <h2 className="mb-4 header-3">Event Podiums</h2>
        <ul className="space-y-6">
          {standingData.podiums.map((event, i) => (
            <li key={i + "_podium"} className="p-4 card">
              <h3 className="mb-3 header-4">{event.event}</h3>
              <div className="space-y-2">
                {event.first.map((team, i) => (
                  <div className="flex items-center gap-2" key={`first_${i}`}>
                    <img src={Gold} alt="Gold" className="h-5" />
                    <span>{team.name}</span>
                  </div>
                ))}
                {event.second.map((team, i) => (
                  <div className="flex items-center gap-2" key={`second_${i}`}>
                    <img src={Silver} alt="Silver" className="h-5" />
                    <span>{team.name}</span>
                  </div>
                ))}
                {event.third.map((team, i) => (
                  <div className="flex items-center gap-2" key={`third_${i}`}>
                    <img src={Bronze} alt="Bronze" className="h-5" />
                    <span>{team.name}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="py-6 container-padding">
      {(status === "pre" || status == "pre_admin") && renderScoringInfo()}
      {renderStandings()}
      {renderPodiums()}
    </div>
  );
};

export default Standings;
