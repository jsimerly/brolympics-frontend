import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../Util/BackLink";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { fetchPlayerCareer, fetchContests } from "../../../api/client";
import { MiniStat, RivalryList } from "./HistorySections";
import { ordinal, trimFloat } from "../../Util/format";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

/** One line per Brolympics attended: team, overall finish, points, hardware.
 * "History", not "seasons" -- these can happen weekly if the league wants. */
const Seasons = ({ seasons }) => {
  if (!seasons?.length) return null;
  return (
    <section>
      <h2 className="mb-3 header-3">History</h2>
      <div className="overflow-hidden card">
        <table className="w-full">
          <thead>
            <tr className="text-xs tracking-wide uppercase bg-gray-50 text-light">
              <th className="p-2 text-left">Brolympics</th>
              <th className="p-2 text-left">Team</th>
              <th className="p-2 w-[55px]">Finish</th>
              <th className="p-2 w-[55px]">Pts</th>
              <th className="p-2 w-[45px]" title="Event wins">
                <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s, i) => (
              <tr key={s.brolympics} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-2 border-t">
                  {s.brolympics}
                  {!s.complete && (
                    <span className="text-[10px] text-light"> (live)</span>
                  )}
                </td>
                <td className="p-2 border-t">{s.team}</td>
                <td className="p-2 text-center border-t">
                  {s.rank && s.rank <= 3 && s.complete ? (
                    <img
                      src={medalFor[s.rank]}
                      alt={ordinal(s.rank)}
                      className="h-4 mx-auto"
                    />
                  ) : s.rank ? (
                    ordinal(s.rank)
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-2 text-center border-t">
                  {trimFloat(s.points)}
                </td>
                <td className="p-2 text-center border-t">{s.event_wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

/** Every h2h game tallied against the players across the table. */
const Rivalries = ({ rivalries }) => {
  if (!rivalries?.length) return null;
  return (
    <section>
      <h2 className="mb-3 header-3">Rivalries</h2>
      <RivalryList
        rivalries={rivalries.map((r) => ({ ...r, name: r.player }))}
      />
    </section>
  );
};

const StatTile = ({ icon, value, label }) => (
  <div className="flex flex-col items-center flex-1 gap-1 p-3 card">
    <div className="text-primary">{icon}</div>
    <span className="text-xl font-bold leading-none">{value}</span>
    <span className="text-[11px] text-light">{label}</span>
  </div>
);

/** One line of game history inside a discipline dropdown. seasonBreak marks
 * the first row of a different Brolympics with a heavier divider. */
const ContestRow = ({ contest, myTeamUuids, playerUuid, seasonBreak }) => {
  const entries = contest.entries || [];
  let line = null;

  if (contest.kind === "match") {
    const mine = entries.find((e) => myTeamUuids.has(String(e.team)));
    const opp = entries.find((e) => !myTeamUuids.has(String(e.team)));
    if (!mine) return null;
    const result =
      mine.outcome === "w" ? "W" : mine.outcome === "t" ? "T" : "L";
    line = (
      <>
        <span
          className={`w-5 font-bold ${
            mine.outcome === "w"
              ? "text-tertiary"
              : mine.outcome === "l"
              ? "text-red"
              : ""
          }`}
        >
          {result}
        </span>
        <span className="flex-grow">
          {mine.score != null || opp?.score != null
            ? `${mine.score ?? "—"}–${opp?.score ?? "—"} `
            : ""}
          vs {opp?.team_name ?? "TBD"}
        </span>
      </>
    );
  } else if (contest.kind === "heat") {
    const mine = entries.find((e) => String(e.player) === String(playerUuid));
    if (!mine) return null;
    line = (
      <span className="flex-grow">
        {mine.placement ? `Finished #${mine.placement}` : "—"} (heat of{" "}
        {entries.filter((e) => e.player).length})
      </span>
    );
  } else {
    const mine = entries.find((e) => String(e.player) === String(playerUuid));
    const teamEntry = entries.find((e) => e.team && !e.player);
    const score = mine?.score ?? teamEntry?.score;
    line = (
      <span className="flex-grow">
        {score ?? "—"}
        {mine?.score != null && teamEntry?.score != null && (
          <span className="text-light"> (team {teamEntry.score})</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 py-1 text-sm ${
        seasonBreak
          ? "mt-2 pt-2 border-t-2 border-gray-300"
          : "border-t first:border-t-0"
      }`}
    >
      {line}
      {contest.stage_structure === "knockout" && (
        <AccountTreeOutlinedIcon
          sx={{ fontSize: 14 }}
          className="text-primary"
          titleAccess="Playoff game"
        />
      )}
      <span className="text-xs text-light whitespace-nowrap">
        {contest.brolympics_name}
      </span>
    </div>
  );
};

const DisciplineCard = ({ d, contests, myTeamUuids, playerUuid }) => {
  const [open, setOpen] = useState(false);
  const mine = contests.filter(
    (c) => c.event_type_name === d.event_type && c.is_complete
  );

  return (
    <div className="card">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center justify-between pb-2">
          <h3 className="font-bold">{d.event_type}</h3>
          <span className="flex items-center gap-1 text-sm text-light">
            {d.years.join(", ")}
            {open ? (
              <ExpandLessIcon sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 18 }} />
            )}
          </span>
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
                <span className="text-light">
                  {" "}
                  (avg {d.avg_score.toFixed(1)})
                </span>
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
      {open && (
        <div className="px-4 pb-3">
          <h4 className="pb-1 text-xs font-semibold tracking-wide uppercase text-light">
            Game history
          </h4>
          {mine.map((contest, i) => (
            <ContestRow
              contest={contest}
              myTeamUuids={myTeamUuids}
              playerUuid={playerUuid}
              seasonBreak={
                i > 0 && contest.brolympics !== mine[i - 1].brolympics
              }
              key={contest.uuid}
            />
          ))}
          {mine.length === 0 && (
            <p className="text-sm text-light">No recorded games.</p>
          )}
        </div>
      )}
    </div>
  );
};

const PlayerStats = () => {
  const { uuid, playerUuid } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [careerData, contestData] = await Promise.all([
          fetchPlayerCareer(playerUuid),
          fetchContests({ player: playerUuid }),
        ]);
        setCareer(careerData);
        setContests(contestData);
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };
    getData();
  }, [playerUuid]);

  if (!career) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const points = Number.isInteger(career.total_points)
    ? career.total_points
    : career.total_points.toFixed(1);
  const myTeamUuids = new Set((career.teams || []).map((t) => String(t.uuid)));

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding w-full max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <BackLink to={`/league/${uuid}`} label="League" />
        <div className="flex items-center gap-3 pt-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400">
            <PersonOutlineIcon sx={{ fontSize: 32 }} />
          </div>
          <h1 className="text-3xl font-bold leading-tight text-near-black">
            {career.player}
          </h1>
        </div>
      </div>

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

      {career.records?.length > 0 && (
        <div className="flex items-start gap-2 p-3 text-sm card">
          <WhatshotOutlinedIcon
            sx={{ fontSize: 18 }}
            className="mt-0.5 text-primary"
          />
          <span>
            <span className="font-semibold">Record holder: </span>
            {career.records
              .map(
                (r) =>
                  `${r.event_type} (${r.score}${r.team ? ` w/ ${r.team}` : ""} · ${r.brolympics})`
              )
              .join(", ")}
          </span>
        </div>
      )}

      <Seasons seasons={career.seasons} />

      <Rivalries rivalries={career.rivalries} />

      {career.disciplines.length > 0 && (
        <section>
          <h2 className="mb-3 header-3">By Event</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {career.disciplines.map((d, i) => (
              <DisciplineCard
                d={d}
                contests={contests}
                myTeamUuids={myTeamUuids}
                playerUuid={playerUuid}
                key={i + "_discipline"}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PlayerStats;
