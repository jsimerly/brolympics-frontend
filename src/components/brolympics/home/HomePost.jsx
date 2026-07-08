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

/** The trophy room: what a Brolympics home shows once it's over. */
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
    <div className="max-w-3xl px-4 py-6 mx-auto space-y-6">
      {champions.map((row) => (
        <section
          className="flex flex-col items-center gap-2 px-6 py-8 text-center card"
          key={row.team.uuid}
        >
          <span className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-light">
            <img src={Gold} alt="" className="h-5" /> Champions
          </span>
          <Img
            src={row.team.img}
            alt={row.team.name}
            className="object-cover w-24 h-24 rounded-xl"
          />
          <h2 className="text-3xl font-bold leading-tight text-near-black">
            {row.team.name}
          </h2>
          {row.team.players?.length > 0 && (
            <p className="text-light">{row.team.players.join(" & ")}</p>
          )}
          <span className="px-3 py-1 mt-1 text-sm font-semibold text-white rounded-full bg-primary">
            {fmtPoints(row.points)} pts
          </span>
        </section>
      ))}

      {runnersUp.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {runnersUp.map((row) => (
            <div
              className="flex flex-col items-center gap-1 p-4 text-center card"
              key={row.team.uuid}
            >
              <img
                src={medalFor[row.rank]}
                alt={`#${row.rank}`}
                className="h-5"
              />
              <Img
                src={row.team.img}
                alt={row.team.name}
                className="object-cover w-14 h-14 rounded-lg"
              />
              <span className="font-semibold leading-tight">
                {row.team.name}
              </span>
              <span className="text-sm text-light">
                {fmtPoints(row.points)} pts
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <section className="overflow-hidden card">
          <h3 className="p-3 font-bold">Final Standings</h3>
          <table className="w-full text-sm">
            <tbody>
              {standings.map((row, i) => (
                <tr
                  key={row.team.uuid}
                  className={i % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="w-10 p-2 font-semibold text-center border-t">
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
                        className="object-cover w-7 h-7 rounded-md"
                      />
                      {row.team.name}
                    </div>
                  </td>
                  <td className="w-16 p-2 font-semibold text-center border-t">
                    {fmtPoints(row.points)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {podiums.length > 0 && (
          <section className="overflow-hidden card">
            <h3 className="p-3 font-bold">Event Winners</h3>
            <div>
              {podiums.map((podium, i) => (
                <div
                  key={podium.event_uuid || i}
                  className={`flex items-center gap-2 p-2 text-sm border-t ${
                    eventFor(podium) ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={() => goToEvent(podium)}
                >
                  <img src={Gold} alt="Winner" className="h-4" />
                  <span className="font-medium">
                    {podium.first.join(", ")}
                  </span>
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
