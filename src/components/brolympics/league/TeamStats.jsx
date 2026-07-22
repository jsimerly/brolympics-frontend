import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import Img from "../../Util/Img";
import { fetchTeamCareer } from "../../../api/client";
import { ordinal, trimFloat } from "../../Util/format";
import {
  AchievementChip,
  MiniStat,
  RivalryList,
} from "./HistorySections";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

const StatTile = ({ icon, value, label }) => (
  <div className="flex flex-col items-center justify-center flex-1 gap-1 p-3 text-center card">
    <div className="text-primary">{icon}</div>
    <span className="text-xl font-bold leading-none">{value}</span>
    <span className="text-[11px] text-light">{label}</span>
  </div>
);

/** The team NAME's career page -- the institution through the years: header,
 * tiles, the h2h line, every season's seat, and the trophy shelf. */
const TeamStats = () => {
  const { uuid, teamName } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);

  useEffect(() => {
    fetchTeamCareer(uuid, decodeURIComponent(teamName))
      .then(setCareer)
      .catch((error) => console.error("Error fetching team stats:", error));
  }, [uuid, teamName]);

  if (!career) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const record = career.record || {};
  const games = (record.wins || 0) + (record.losses || 0) + (record.ties || 0);
  const winPct = games > 0 ? Math.round((record.wins / games) * 100) : null;
  const chipsOf = (key) =>
    (career.disciplines || [])
      .filter((d) => d[key] > 0)
      .map((d) => ({ name: d.event_type, count: d[key] }));
  const wins = chipsOf("event_wins");
  const seconds = chipsOf("seconds");
  const thirds = chipsOf("thirds");

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
          <Img
            src={career.img}
            alt={career.name}
            kind="team"
            className="object-cover rounded-lg w-14 h-14"
          />
          <h1 className="text-3xl font-bold leading-tight text-near-black">
            {career.name}
          </h1>
        </div>
      </div>

      <div className="flex gap-3">
        <StatTile
          icon={<DiamondOutlinedIcon />}
          value={trimFloat(career.total_points)}
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

      {(games > 0 || career.avg_finish != null) && (
        <div className="flex gap-2">
          {games > 0 && (
            <MiniStat
              value={`${record.wins}-${record.losses}${
                record.ties ? `-${record.ties}` : ""
              }`}
              label="H2H Record"
            />
          )}
          {games > 0 && <MiniStat value={`${winPct}%`} label="Win %" />}
          {career.avg_finish != null && (
            <MiniStat value={career.avg_finish} label="Avg Finish" />
          )}
        </div>
      )}

      {(career.best_event || career.worst_event) && (
        <div className="flex gap-2">
          {career.best_event && (
            <MiniStat
              value={career.best_event.event_type}
              label={`Best Event · avg ${career.best_event.avg_finish}`}
            />
          )}
          {career.worst_event && (
            <MiniStat
              value={career.worst_event.event_type}
              label={`Worst Event · avg ${career.worst_event.avg_finish}`}
            />
          )}
        </div>
      )}

      {career.appearances?.length > 0 && (
        <section>
          <h2 className="mb-3 header-3">History</h2>
          <div className="overflow-hidden card">
            <table className="w-full">
              <thead>
                <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
                  <th className="p-2 text-left">Brolympics</th>
                  <th className="p-2 text-left">Roster</th>
                  <th className="p-2 w-[55px]">Finish</th>
                  <th className="p-2 w-[55px]">Pts</th>
                </tr>
              </thead>
              <tbody>
                {career.appearances.map((a, i) => (
                  <tr
                    key={a.team_uuid}
                    className={i % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-2 border-t whitespace-nowrap">
                      {a.brolympics}
                      {!a.complete && (
                        <span className="text-[10px] text-light"> (live)</span>
                      )}
                    </td>
                    <td className="p-2 text-sm border-t text-light">
                      {a.players.join(", ") || "—"}
                    </td>
                    <td className="p-2 text-center border-t">
                      {a.rank && a.rank <= 3 ? (
                        <img
                          src={medalFor[a.rank]}
                          alt={ordinal(a.rank)}
                          className="h-4 mx-auto"
                        />
                      ) : a.rank ? (
                        ordinal(a.rank)
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2 text-center border-t">
                      {trimFloat(a.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {career.rivalries?.length > 0 && (
        <section>
          <h2 className="mb-3 header-3">Rivalries</h2>
          <RivalryList
            rivalries={career.rivalries.map((r) => ({ ...r, name: r.team }))}
          />
        </section>
      )}

      {(wins.length > 0 || seconds.length > 0 || thirds.length > 0) && (
        <section>
          <h2 className="mb-3 header-3">Trophy Shelf</h2>
          {/* the full page shows the WHOLE shelf -- no +N-more fold here */}
          <div className="flex flex-wrap gap-2">
            {wins.map((it) => (
              <AchievementChip
                icon={<img src={Gold} alt="" className="h-3.5" />}
                name={it.name}
                count={it.count}
                title="Event wins"
                key={"win_" + it.name}
              />
            ))}
            {seconds.map((it) => (
              <AchievementChip
                icon={<img src={Silver} alt="" className="h-3.5" />}
                name={it.name}
                count={it.count}
                title="Second-place finishes"
                key={"second_" + it.name}
              />
            ))}
            {thirds.map((it) => (
              <AchievementChip
                icon={<img src={Bronze} alt="" className="h-3.5" />}
                name={it.name}
                count={it.count}
                title="Third-place finishes"
                key={"third_" + it.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TeamStats;
