import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import Img from "../../Util/Img";
import {
  fetchBrolympicsStandings,
  fetchBrolympicsPodiums,
} from "../../../api/client";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const fmtPoints = (points) =>
  Number.isInteger(points) ? points : points?.toFixed(1);

/** The trophy room: what a Brolympics home shows once it's over. Styled to
 * match the league page's champion cards and history tables. */
const HomePost = ({ events = [] }) => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [standings, setStandings] = useState(null);
  const [podiums, setPodiums] = useState([]);

  useEffect(() => {
    const getResults = async () => {
      try {
        const [rows, eventPodiums] = await Promise.all([
          fetchBrolympicsStandings(uuid),
          fetchBrolympicsPodiums(uuid),
        ]);
        setStandings(rows);
        setPodiums(eventPodiums);
      } catch (error) {
        console.error("Error fetching final results:", error);
      }
    };
    getResults();
  }, [uuid]);

  if (!standings) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const champions = standings.filter((row) => row.rank === 1);
  const runnersUp = standings.filter(
    (row) => row.rank === 2 || row.rank === 3
  );
  const eventFor = (podium) =>
    events.find((e) => String(e.uuid) === String(podium.event_uuid));

  const goToEvent = (podium) => {
    const event = eventFor(podium);
    if (event) navigate(`/b/${uuid}/event/${event.type}/${event.uuid}`);
  };

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
              {row.team.players?.length > 0 && (
                <span className="text-sm text-light">
                  {row.team.players.join(" & ")}
                </span>
              )}
            </div>
            <span className="ml-auto text-xl font-bold text-primary whitespace-nowrap">
              {fmtPoints(row.points)}
            </span>
          </div>
        ))}
        {runnersUp.length > 0 && (
          <div className="flex border-t divide-x">
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
                <tr className="text-white bg-primary">
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
                          {row.team.players?.length > 0 && (
                            <span className="text-xs leading-tight text-light">
                              {row.team.players.join(" & ")}
                            </span>
                          )}
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
            <h2 className="mb-4 header-3">Event Winners</h2>
            <div className="overflow-hidden card">
              {podiums.map((podium, i) => (
                <div
                  key={podium.event_uuid || i}
                  className={`flex items-center gap-2 p-3 text-sm border-t first:border-t-0 ${
                    eventFor(podium) ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={() => goToEvent(podium)}
                >
                  <img src={Gold} alt="Winner" className="h-4" />
                  <span className="font-medium">{podium.first.join(", ")}</span>
                  <span className="flex-grow text-right text-light">
                    {podium.event}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePost;
