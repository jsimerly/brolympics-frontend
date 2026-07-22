import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackLink from "../../Util/BackLink";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Gold from "../../../assets/svgs/gold.svg";
import Silver from "../../../assets/svgs/silver.svg";
import Bronze from "../../../assets/svgs/bronze.svg";
import { fetchEventTypeHistory } from "../../../api/client";
import { MiniStat, leaderLine } from "./HistorySections";
import ShowMore from "../../Util/ShowMore";
import { INITIAL_VISIBLE, nextVisible } from "../../Util/pagination";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };
const FORMAT_LABEL = {
  h2h: "Head to Head",
  ind: "Individual",
  team: "Team",
  ffa: "Free-for-All",
};

/** Value text auto-shrinks: numbers sit big, "Luxembourg ×2" fits too. */
const StatTile = ({ icon, value, label }) => {
  const text = String(value);
  const size =
    text.length > 12 ? "text-sm" : text.length > 7 ? "text-base" : "text-xl";
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-1 p-3 text-center card">
      <div className="text-primary">{icon}</div>
      <span
        className={`${size} w-full font-bold leading-tight break-words`}
      >
        {text}
      </span>
      <span className="text-[11px] text-light">{label}</span>
    </div>
  );
};

const RankedList = ({ title, sub, rows, total, onMore }) =>
  rows?.length > 0 && (
    <section className="p-4 card">
      <h2 className="pb-2 font-bold">
        {title}
        {sub && (
          <span className="ml-2 text-[10px] font-normal text-light">{sub}</span>
        )}
      </h2>
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <div className="flex items-center gap-2 text-sm" key={i + "_row"}>
            <span className="w-5 font-semibold text-light">{i + 1}.</span>
            <span className="flex-grow min-w-0 truncate">{row.who}</span>
            <span className="text-light shrink-0">{row.detail}</span>
          </div>
        ))}
      </div>
      {total != null && (
        <ShowMore shown={rows.length} total={total} onMore={onMore} />
      )}
    </section>
  );

/** The discipline's career page: the same treatment players get -- header,
 * tiles, the champions timeline, all-time leaders, and the record book. */
const EventStats = () => {
  const { uuid, eventTypeUuid } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [visibleLeaders, setVisibleLeaders] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    // leaders=0: the full page gets everyone and pages through client-side
    fetchEventTypeHistory(eventTypeUuid, 0)
      .then(setHistory)
      .catch((error) => console.error("Error fetching event stats:", error));
  }, [eventTypeUuid]);

  if (!history) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const completeYears = history.years.filter(
    (y) => y.complete && y.podium.length > 0
  );
  // the dynasty count: who has taken this event the most
  const titles = {};
  completeYears.forEach((y) => {
    const champ = y.podium.find((p) => p.rank === 1);
    if (champ) titles[champ.team] = (titles[champ.team] || 0) + 1;
  });
  const [topName, topCount] = Object.entries(titles).sort(
    (a, b) => b[1] - a[1]
  )[0] || ["—", 0];
  const reigning =
    completeYears[completeYears.length - 1]?.podium.find((p) => p.rank === 1)
      ?.team ?? "—";

  return (
    <div className="min-h-[calc(100vh-80px)] container-padding w-full max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <BackLink to={`/league/${uuid}`} label="League" />
        <div className="pt-3">
          <h1 className="text-3xl font-bold leading-tight text-near-black">
            {history.event_type}
          </h1>
          <p className="text-sm text-light">
            {FORMAT_LABEL[history.format] || history.format} · held{" "}
            {history.years.length} time
            {history.years.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <StatTile
          icon={<CalendarMonthOutlinedIcon />}
          value={history.years.length}
          label="Brolympics"
        />
        <StatTile
          icon={<EmojiEventsOutlinedIcon />}
          value={reigning}
          label="Reigning Champion"
        />
        <StatTile
          icon={<GroupsOutlinedIcon />}
          value={topCount > 0 ? `${topName}${topCount > 1 ? ` ×${topCount}` : ""}` : "—"}
          label="Most Titles"
        />
      </div>

      {(history.superlatives?.best || history.superlatives?.worst) && (
        <div className="flex gap-2">
          {history.superlatives.best && (
            <MiniStat
              value={history.superlatives.best.team}
              label={`Dynasty · avg ${history.superlatives.best.avg_finish}`}
            />
          )}
          {history.superlatives.worst && (
            <MiniStat
              value={history.superlatives.worst.team}
              label={`Cursed · avg ${history.superlatives.worst.avg_finish}`}
            />
          )}
        </div>
      )}

      {completeYears.length > 0 && (
        <section className="p-4 card">
          <h2 className="pb-2 font-bold">Champions Timeline</h2>
          <div className="space-y-3">
            {[...history.years].reverse().map((year, i) => (
              <div key={i + "_year"}>
                <h3 className="text-sm font-semibold">
                  {year.brolympics}
                  {!year.complete && (
                    <span className="ml-2 text-[10px] font-normal text-light">
                      (in progress)
                    </span>
                  )}
                </h3>
                <div className="space-y-1 pt-0.5">
                  {year.podium.map((row) => (
                    <div
                      className="flex items-center gap-2 text-sm"
                      key={row.rank}
                    >
                      <img
                        src={medalFor[row.rank]}
                        alt={`#${row.rank}`}
                        className="h-4"
                      />
                      <span>{row.team}</span>
                    </div>
                  ))}
                  {year.podium.length === 0 && (
                    <p className="text-sm text-light">No final results.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <RankedList
        title="All-Time Leaders"
        sub="by points earned"
        rows={(history.leaders || [])
          .slice(0, visibleLeaders)
          .map((leader) => ({
            who: leader.who,
            detail: leaderLine(leader, history.format),
          }))}
        total={(history.leaders || []).length}
        onMore={() => setVisibleLeaders(nextVisible(visibleLeaders))}
      />

      <RankedList
        title="Record Book"
        sub="best single brolympics"
        rows={(history.best_seasons || []).map((row) => ({
          who: row.who,
          detail: `${row.wins}-${row.losses}${
            row.ties ? `-${row.ties}` : ""
          } (${Math.round(row.win_pct * 100)}%) · ${row.brolympics}`,
        }))}
      />

      <RankedList
        title="Record Book"
        sub="best single outing"
        rows={(history.best_performances || []).map((row) => ({
          who: row.who,
          detail: `${row.score} · ${row.brolympics}`,
        }))}
      />
    </div>
  );
};

export default EventStats;
