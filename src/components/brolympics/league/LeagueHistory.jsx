import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import {
  fetchLeagueAllTime,
  fetchEventTypes,
  fetchPlayerCareer,
  fetchEventTypeHistory,
} from "../../../api/client";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const Championships = ({ championships }) => (
  <section>
    <h2 className="mb-4 header-3">Championships</h2>
    <div className="space-y-3">
      {championships.map((row, i) => (
        <div className="p-4 card" key={i + "_championship"}>
          <div className="flex items-center gap-3">
            <img src={Gold} alt="Champion" className="h-6" />
            <div>
              <h3 className="font-bold text-near-black">{row.brolympics}</h3>
              {row.champions.map((champ, j) => (
                <p className="text-sm" key={j + "_champ"}>
                  <span className="font-semibold">{champ.team}</span>
                  {champ.players.length > 0 && (
                    <span className="text-light">
                      {" — "}
                      {champ.players.join(" & ")}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
      {championships.length === 0 && (
        <p className="text-light">No completed Brolympics yet.</p>
      )}
    </div>
  </section>
);

const PlayerCareer = ({ playerUuid }) => {
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchPlayerCareer(playerUuid)
      .then(setCareer)
      .catch((error) => console.error("Error fetching career:", error));
  }, [playerUuid]);

  if (!career) return <div className="p-2 text-sm text-light">Loading...</div>;

  return (
    <div className="p-2 space-y-2">
      {career.disciplines.map((d, i) => (
        <div className="p-2 border rounded-md" key={i + "_discipline"}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{d.event_type}</h4>
            <span className="text-sm text-light">
              {d.years.join(", ")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            <span>Points: {d.points}</span>
            {d.format === "h2h" ? (
              <span>
                Record: {d.record.wins}-{d.record.losses}
                {d.record.ties ? `-${d.record.ties}` : ""}
              </span>
            ) : d.heats.played > 0 ? (
              <span>
                Heats: {d.heats.wins} wins / {d.heats.played}
              </span>
            ) : (
              <span>
                Best: {d.best_score ?? "—"}
                {d.avg_score != null && ` (avg ${d.avg_score.toFixed(1)})`}
              </span>
            )}
            <span>Event wins: {d.event_wins}</span>
            <span>Podiums: {d.podiums}</span>
          </div>
        </div>
      ))}
      {career.disciplines.length === 0 && (
        <p className="text-sm text-light">No recorded events.</p>
      )}
    </div>
  );
};

const Leaderboard = ({ leaderboard }) => {
  const [openPlayer, setOpenPlayer] = useState(null);

  return (
    <section>
      <h2 className="mb-4 header-3">All-Time Leaderboard</h2>
      <div className="overflow-hidden card">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-primary">
              <th className="p-2 w-[40px]">#</th>
              <th className="p-2 text-left">Player</th>
              <th className="p-2 w-[60px]">Pts</th>
              <th className="p-2 w-[50px]">
                <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <React.Fragment key={row.uuid}>
                <tr
                  className={`cursor-pointer ${i % 2 === 0 ? "bg-gray-50" : ""}`}
                  onClick={() =>
                    setOpenPlayer(openPlayer === row.uuid ? null : row.uuid)
                  }
                >
                  <td className="p-2 font-semibold text-center border-t">
                    {i + 1}
                  </td>
                  <td className="p-2 border-t">
                    <div className="flex items-center justify-between">
                      {row.player}
                      {openPlayer === row.uuid ? (
                        <ExpandLessIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center border-t">
                    {Number.isInteger(row.points)
                      ? row.points
                      : row.points.toFixed(1)}
                  </td>
                  <td className="p-2 text-center border-t">{row.event_wins}</td>
                </tr>
                {openPlayer === row.uuid && (
                  <tr>
                    <td colSpan={4} className="border-t">
                      <PlayerCareer playerUuid={row.uuid} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const EventTypeHistory = ({ eventTypeUuid }) => {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    fetchEventTypeHistory(eventTypeUuid)
      .then(setHistory)
      .catch((error) => console.error("Error fetching history:", error));
  }, [eventTypeUuid]);

  if (!history)
    return <div className="p-2 text-sm text-light">Loading...</div>;

  return (
    <div className="p-2 space-y-3">
      {history.years.map((year, i) => (
        <div key={i + "_year"}>
          <h4 className="font-semibold">
            {year.brolympics}
            {!year.complete && (
              <span className="ml-2 text-[10px] text-light">(in progress)</span>
            )}
          </h4>
          <div className="space-y-1">
            {year.podium.map((row) => (
              <div className="flex items-center gap-2 text-sm" key={row.rank}>
                <img src={medalFor[row.rank]} alt={`#${row.rank}`} className="h-4" />
                <span>{row.team}</span>
              </div>
            ))}
            {year.podium.length === 0 && (
              <p className="text-sm text-light">No final results.</p>
            )}
          </div>
        </div>
      ))}
      {history.best_performances.length > 0 && (
        <div>
          <h4 className="font-semibold">Best Performances</h4>
          {history.best_performances.map((row, i) => (
            <p className="text-sm" key={i + "_best"}>
              {row.score} — {row.who}{" "}
              <span className="text-light">({row.brolympics})</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const Events = ({ eventTypes }) => {
  const [openType, setOpenType] = useState(null);

  return (
    <section>
      <h2 className="mb-4 header-3">Events Through the Years</h2>
      <div className="space-y-2">
        {eventTypes.map((et) => (
          <div className="card" key={et.uuid}>
            <div
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() => setOpenType(openType === et.uuid ? null : et.uuid)}
            >
              <h3 className="font-semibold">{et.name}</h3>
              {openType === et.uuid ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {openType === et.uuid && (
              <EventTypeHistory eventTypeUuid={et.uuid} />
            )}
          </div>
        ))}
        {eventTypes.length === 0 && (
          <p className="text-light">No events yet.</p>
        )}
      </div>
    </section>
  );
};

const Lineages = ({ lineages }) => (
  <section>
    <h2 className="mb-4 header-3">Team Lineages</h2>
    <div className="space-y-3">
      {(lineages?.by_duo || []).map((duo, i) => (
        <div className="p-4 card" key={i + "_duo"}>
          <h3 className="font-semibold">{duo.players.join(" & ")}</h3>
          <div className="text-sm text-light">
            {duo.appearances.map((a, j) => (
              <p key={j + "_appearance"}>
                {a.brolympics}: <span className="text-near-black">{a.team_name}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
      {(lineages?.by_duo || []).length === 0 && (
        <p className="text-light">
          No repeat duos yet — lineages appear once a pair teams up twice.
        </p>
      )}
    </div>
  </section>
);

const LeagueHistory = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [allTime, setAllTime] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const [allTimeData, types] = await Promise.all([
          fetchLeagueAllTime(uuid),
          fetchEventTypes(uuid),
        ]);
        setAllTime(allTimeData);
        setEventTypes(types);
      } catch (error) {
        console.error("Error fetching league history:", error);
      }
    };
    getHistory();
  }, [uuid]);

  if (!allTime) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding py-6 space-y-8">
      <div>
        <button className="flex items-center gap-1" onClick={() => navigate(`/league/${uuid}`)}>
          <ArrowBackIcon /> Back
        </button>
        <h1 className="text-[32px] font-bold leading-none pt-3 text-primary">
          {allTime.league} History
        </h1>
      </div>
      <Championships championships={allTime.championships} />
      <Leaderboard leaderboard={allTime.leaderboard} />
      <Events eventTypes={eventTypes} />
      <Lineages lineages={allTime.team_lineages} />
    </div>
  );
};

export default LeagueHistory;
