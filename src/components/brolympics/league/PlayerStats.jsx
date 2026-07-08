import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { fetchPlayerCareer } from "../../../api/client";
import { PlayerTeams } from "./HistorySections";

const StatTile = ({ icon, value, label }) => (
  <div className="flex flex-col items-center flex-1 gap-1 p-3 card">
    <div className="text-primary">{icon}</div>
    <span className="text-xl font-bold leading-none">{value}</span>
    <span className="text-[11px] text-light">{label}</span>
  </div>
);

const DisciplineCard = ({ d }) => (
  <div className="p-4 card">
    <div className="flex items-center justify-between pb-2">
      <h3 className="font-bold">{d.event_type}</h3>
      <span className="text-sm text-light">{d.years.join(", ")}</span>
    </div>
    <div className="grid grid-cols-2 text-sm gap-x-6 gap-y-1">
      <span>
        Points: <span className="font-semibold">{d.points}</span>
      </span>
      {d.format === "h2h" ? (
        <span>
          Record:{" "}
          <span className="font-semibold">
            {d.record.wins}-{d.record.losses}
            {d.record.ties ? `-${d.record.ties}` : ""}
          </span>
        </span>
      ) : d.heats.played > 0 ? (
        <span>
          Heats:{" "}
          <span className="font-semibold">
            {d.heats.wins} wins / {d.heats.played}
          </span>
        </span>
      ) : (
        <span>
          Best: <span className="font-semibold">{d.best_score ?? "—"}</span>
          {d.avg_score != null && (
            <span className="text-light"> (avg {d.avg_score.toFixed(1)})</span>
          )}
        </span>
      )}
      <span>
        Event wins: <span className="font-semibold">{d.event_wins}</span>
      </span>
      <span>
        Podiums: <span className="font-semibold">{d.podiums}</span>
      </span>
    </div>
  </div>
);

const PlayerStats = () => {
  const { uuid, playerUuid } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchPlayerCareer(playerUuid)
      .then(setCareer)
      .catch((error) => console.error("Error fetching career:", error));
  }, [playerUuid]);

  if (!career) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const points = Number.isInteger(career.total_points)
    ? career.total_points
    : career.total_points.toFixed(1);

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding w-full max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <button
          className="flex items-center gap-1"
          onClick={() => navigate(`/league/${uuid}`)}
        >
          <ArrowBackIcon /> Back
        </button>
        <div className="flex items-center gap-3 pt-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400">
            <PersonOutlineIcon sx={{ fontSize: 32 }} />
          </div>
          <h1 className="text-3xl font-bold leading-tight text-near-black">
            {career.player}
          </h1>
        </div>
      </div>

      <PlayerTeams teams={career.teams} />

      <div className="flex gap-3">
        <StatTile
          icon={<DiamondOutlinedIcon />}
          value={points}
          label="All-Time Points"
        />
        <StatTile
          icon={<EmojiEventsOutlinedIcon />}
          value={career.event_wins}
          label="Event Wins"
        />
        <StatTile
          icon={<WorkspacePremiumOutlinedIcon />}
          value={career.podiums}
          label="Podiums"
        />
      </div>

      {career.disciplines.length > 0 && (
        <section>
          <h2 className="mb-3 header-3">By Event</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {career.disciplines.map((d, i) => (
              <DisciplineCard d={d} key={i + "_discipline"} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PlayerStats;
