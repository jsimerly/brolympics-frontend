import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBrolympicsStandings,
  fetchBrolympicsPodiums,
} from "../../../api/client";
import Img from "../../Util/Img";
import PlayerNames from "../../Util/PlayerNames";
import useCachedFetch from "../../../hooks/useCachedFetch";
import { SkeletonPage } from "../../Util/Skeleton";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";

const Standings = ({ status, teams }) => {
  const { uuid } = useParams();
  const { data: standingData, loading } = useCachedFetch(
    `bro-standings:${uuid}`,
    async () => {
      const [standings, podiums] = await Promise.all([
        fetchBrolympicsStandings(uuid),
        fetchBrolympicsPodiums(uuid),
      ]);
      return { standings, podiums };
    }
  );

  if (loading) {
    return (
      <div className="py-6 container-padding w-full max-w-3xl mx-auto space-y-8">
        <SkeletonPage />
      </div>
    );
  }

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
      <h3 className="header-3">Scoring</h3>
      <p className="mb-4 text-light">
        Scoring in the top 3 will earn bonus points.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
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
        points: 0,
        team: team,
      }));
    }

    const imgFor = (row) =>
      row.team.img ?? teams?.find((t) => t.uuid === row.team.uuid)?.img;
    const playersOf = (row) =>
      (row.team.players || []).map((p) => (typeof p === "string" ? p : p.name));
    const fmt = (points) =>
      Number.isInteger(points) ? points : points?.toFixed(1);

    const rows = [...standingsData].sort((a, b) => a.rank - b.rank);
    const medal = { 1: Gold, 2: Silver, 3: Bronze };

    return (
      <div>
        <h2 className="mb-4 header-3">Overall Standings</h2>
        <div className="overflow-hidden card divide-y">
          {rows.map((ranking, i) => {
            // gap to the team directly ahead -- small, chaseable numbers
            // for everyone instead of a giant deficit behind the leader
            const behind = i > 0 ? rows[i - 1].points - ranking.points : 0;
            return (
              <div
                className={`flex items-center gap-3 p-3 ${
                  ranking.rank === 1 ? "bg-secondary/10" : ""
                }`}
                key={i + "_row"}
              >
                <div className="flex items-center justify-center w-7">
                  {medal[ranking.rank] ? (
                    <img
                      src={medal[ranking.rank]}
                      alt={`#${ranking.rank}`}
                      className="h-5"
                    />
                  ) : (
                    <span className="font-semibold text-light">
                      {ranking.rank}
                    </span>
                  )}
                </div>
                <Img
                  src={imgFor(ranking)}
                  alt={ranking.team.name}
                  className="object-cover w-10 h-10 rounded-md"
                />
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-semibold leading-tight truncate">
                    {ranking.team?.name}
                  </span>
                  <PlayerNames
                    players={playersOf(ranking)}
                    className="text-xs leading-tight text-light truncate"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold leading-none">
                    {fmt(ranking.points)}
                  </span>
                  {ranking.rank !== 1 && ranking.rank !== "-" && behind > 0 && (
                    <span className="text-[11px] text-light">
                      -{fmt(behind)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPodiums = () => {
    if (!standingData?.podiums?.length) return null;
    const medals = [
      ["first", Gold],
      ["second", Silver],
      ["third", Bronze],
    ];
    const imgOf = (name) => teams?.find((t) => t.name === name)?.img;
    return (
      <div>
        <h2 className="mb-4 header-3">Event Podiums</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {standingData.podiums.map((event, i) => (
            <div key={i + "_podium"} className="overflow-hidden card">
              <h3 className="px-3 pt-3 pb-2 font-bold border-b">
                {event.event}
              </h3>
              <div className="divide-y">
                {medals.map(
                  ([key, icon]) =>
                    event[key]?.length > 0 && (
                      <div
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                        key={key}
                      >
                        <img src={icon} alt={key} className="h-4" />
                        {event[key].map((row) => (
                          <span
                            className="flex items-center flex-grow gap-1.5 font-medium"
                            key={row.team}
                          >
                            <Img
                              src={imgOf(row.team)}
                              alt={row.team}
                              className="object-cover w-6 h-6 rounded"
                            />
                            {row.team}
                            <span className="flex-grow font-normal text-right text-light">
                              {row.stats?.wins != null
                                ? `${row.stats.wins}-${row.stats.losses}` +
                                  (row.stats.ties ? `-${row.stats.ties}` : "")
                                : row.stats?.total != null
                                ? row.stats.total
                                : ""}
                              {row.points != null && (
                                <span className="ml-2 font-semibold text-near-black">
                                  {Number.isInteger(row.points)
                                    ? row.points
                                    : row.points.toFixed(1)}
                                </span>
                              )}
                            </span>
                          </span>
                        ))}
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 container-padding w-full max-w-3xl mx-auto space-y-8">
      {(status === "pre" || status == "pre_admin") && renderScoringInfo()}
      {renderStandings()}
      {renderPodiums()}
    </div>
  );
};

export default Standings;
