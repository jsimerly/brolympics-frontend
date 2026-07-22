import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import Img from "../../Util/Img";
import PlayerNames from "../../Util/PlayerNames";
import {
  fetchBrolympicsStandings,
  fetchBrolympicsPodiums,
} from "../../../api/client";
import useCachedFetch from "../../../hooks/useCachedFetch";
import { SkeletonPage } from "../../Util/Skeleton";
import { medalTable } from "../events/eventDisplay";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const fmtPoints = (points) =>
  Number.isInteger(points) ? points : points?.toFixed(1);

/** The trophy room: what a Brolympics home shows once it's over. Styled to
 * match the league page's champion cards and history tables. */
const HomePost = ({ events = [] }) => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useCachedFetch(`post-home:${uuid}`, async () => {
    const [rows, eventPodiums] = await Promise.all([
      fetchBrolympicsStandings(uuid),
      fetchBrolympicsPodiums(uuid),
    ]);
    return { standings: rows, podiums: eventPodiums };
  });

  if (loading || !data) {
    return (
      <div className="container-padding w-full max-w-3xl py-6 mx-auto">
        <SkeletonPage />
      </div>
    );
  }
  const { standings, podiums } = data;

  const champions = standings.filter((row) => row.rank === 1);
  const runnersUp = standings.filter(
    (row) => row.rank === 2 || row.rank === 3
  );

  return (
    <div className="container-padding w-full max-w-3xl py-6 mx-auto space-y-8">
      <section className="overflow-hidden card">
        {champions.map((row) => (
          <div className="flex items-center gap-4 px-4 py-4" key={row.team.uuid}>
            <Img
              src={row.team.img}
              alt={row.team.name}
              className="object-cover w-20 h-20 rounded-lg"
            />
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase text-light">
                <img src={Gold} alt="" className="h-4" /> Champions
              </span>
              <span className="text-2xl font-bold leading-tight text-near-black">
                {row.team.name}
              </span>
              <PlayerNames
                players={row.team.players}
                className="text-sm text-light"
              />
            </div>
            <span className="ml-auto text-xl font-bold text-primary whitespace-nowrap">
              {fmtPoints(row.points)}
            </span>
          </div>
        ))}
        {runnersUp.length > 0 && (
          // side-by-side only fits the clean silver+bronze pair; ties stack
          <div
            className={
              runnersUp.length > 2 ? "border-t divide-y" : "flex border-t divide-x"
            }
          >
            {runnersUp.map((row) => (
              <div
                className="flex items-center flex-1 gap-2 px-3 py-2"
                key={row.team.uuid}
              >
                <img
                  src={medalFor[row.rank]}
                  alt={`#${row.rank}`}
                  className="h-4"
                />
                <Img
                  src={row.team.img}
                  alt={row.team.name}
                  className="object-cover w-8 h-8 rounded-md"
                />
                <span className="text-sm font-medium">{row.team.name}</span>
                <span className="ml-auto text-xs text-light">
                  {fmtPoints(row.points)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <section>
          <h2 className="mb-4 header-3">Final Standings</h2>
          <div className="overflow-hidden card">
            <table className="w-full">
              <thead>
                <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
                  <th className="p-2 w-[40px]">#</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2 w-[60px]">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => (
                  <tr
                    key={row.team.uuid}
                    className={i % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-2 font-semibold text-center border-t">
                      {row.rank <= 3 ? (
                        <img
                          src={medalFor[row.rank]}
                          alt={`#${row.rank}`}
                          className="h-4 mx-auto"
                        />
                      ) : (
                        row.rank
                      )}
                    </td>
                    <td className="p-2 border-t">
                      <div className="flex items-center gap-2">
                        <Img
                          src={row.team.img}
                          alt={row.team.name}
                          className="object-cover w-8 h-8 rounded-md"
                        />
                        <div className="flex flex-col">
                          <span className="leading-tight">{row.team.name}</span>
                          <PlayerNames
                            players={row.team.players}
                            className="text-xs leading-tight text-light"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center border-t">
                      {fmtPoints(row.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {podiums.length > 0 && (
          <section>
            <h2 className="mb-4 header-3">Medal Table</h2>
            <div className="overflow-hidden card">
              <table className="w-full">
                <thead>
                  <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
                    <th className="p-2 text-left">Team</th>
                    <th className="p-2 w-[45px]">
                      <img src={Gold} alt="Gold" className="h-4 mx-auto" />
                    </th>
                    <th className="p-2 w-[45px]">
                      <img src={Silver} alt="Silver" className="h-4 mx-auto" />
                    </th>
                    <th className="p-2 w-[45px]">
                      <img src={Bronze} alt="Bronze" className="h-4 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medalTable(podiums).map((row, i) => (
                    <tr
                      key={row.team}
                      className={i % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="p-2 border-t">
                        <div className="flex items-center gap-2">
                          {row.img && (
                            <Img
                              src={row.img}
                              alt={row.team}
                              kind="team"
                              className="object-cover w-6 h-6 rounded shrink-0"
                            />
                          )}
                          <span className="text-sm leading-tight">
                            {row.team}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-sm font-semibold text-center border-t">
                        {row.gold || ""}
                      </td>
                      <td className="p-2 text-sm text-center border-t">
                        {row.silver || ""}
                      </td>
                      <td className="p-2 text-sm text-center border-t">
                        {row.bronze || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePost;
