import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ScaleIcon from "@mui/icons-material/Scale";

export const TIEBREAKER_META = {
  h2h: ["Head-to-head", SportsKabaddiIcon, "Wins in the games between the tied teams."],
  sov: ["Strength of victory", MilitaryTechOutlinedIcon, "Your beaten opponents' win totals."],
  sos: ["Strength of schedule", BarChartIcon, "All your opponents' win totals."],
  diff: ["Point margin", ScaleIcon, "Total score difference (capped per game when the event sets a cap)."],
};

const DEFAULT_ORDER = ["h2h", "sov", "sos", "diff"];

const HeadToHead = ({ event }) => {
  const stages = event?.stages || [];
  const rr = stages.find((s) => s.structure === "round_robin");
  const swiss = stages.find((s) => s.structure === "swiss");
  const ko = stages.find((s) => s.structure === "knockout");
  const games = rr?.config?.games_per_team ?? swiss?.config?.rounds;
  const take = ko?.config?.take;
  const order = (event?.config?.tiebreakers ?? DEFAULT_ORDER).filter(
    (key) => key in TIEBREAKER_META
  );

  return (
    <div className="text-sm">
      <p className="leading-relaxed text-light">
        {swiss
          ? `Group play runs ${games || "several"} swiss rounds — each round pairs teams with similar records.`
          : rr?.config?.full
          ? "Group play is a full round robin: everyone plays everyone once, all scheduled up front."
          : rr
          ? `Group play is a round robin: every team plays ${
              games || "the same number of"
            } games, all scheduled up front.`
          : "This event goes straight to the bracket."}{" "}
        {ko &&
          (take
            ? `The top ${take} seed into the playoff bracket.`
            : "Everyone seeds into the playoff bracket.")}
      </p>

      <h3 className="pt-4 pb-1 font-semibold">Ranking</h3>
      <p className="pb-2 text-light">
        {event?.config?.tiebreakers_rank_standings
          ? "Tiebreakers apply to the full standings in this event: ties are broken for rank and points — no splitting. The chain runs in this order:"
          : "Your record is your rank: teams with equal records share the rank and split the points. Tiebreakers exist for one reason — the bracket has to pick someone. They decide seeding and the last playoff spots, in this order:"}
      </p>
      <ol className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y">
        <li className="flex items-center gap-2.5 px-3 py-2 bg-gray-50">
          <span className="w-4 text-xs font-semibold text-light">—</span>
          <EmojiEventsIcon sx={{ fontSize: 18 }} className="text-primary shrink-0" />
          <div className="min-w-0">
            <span className="font-medium">Record</span>
            <p className="text-[11px] text-light">
              Wins, then ties — always first.
            </p>
          </div>
        </li>
        {order.map((key, i) => {
          const [label, Icon, desc] = TIEBREAKER_META[key] || [key, ScaleIcon, ""];
          return (
            <li className="flex items-center gap-2.5 px-3 py-2" key={key}>
              <span className="w-4 text-xs font-semibold text-light">
                {i + 1}
              </span>
              <Icon sx={{ fontSize: 18 }} className="text-primary shrink-0" />
              <div className="min-w-0">
                <span className="font-medium">{label}</span>
                <p className="text-[11px] text-light">{desc}</p>
              </div>
            </li>
          );
        })}
        <li className="flex items-center gap-2.5 px-3 py-2 bg-gray-50">
          <span className="w-4 text-xs font-semibold text-light">—</span>
          <HandshakeOutlinedIcon sx={{ fontSize: 18 }} className="text-primary shrink-0" />
          <div className="min-w-0">
            <span className="font-medium">Random</span>
            <p className="text-[11px] text-light">
              {event?.config?.tiebreakers_rank_standings
                ? "The final straw when nothing separates the teams — teams still tied after everything share the rank and split points."
                : "The final straw when nothing separates the teams — the order is drawn, but the points still split."}
            </p>
          </div>
        </li>
      </ol>
      <p className="pt-2 text-[11px] text-light">
        Commissioners can reorder the middle of the chain per event in Manage
        → Events.
      </p>
    </div>
  );
};

export default HeadToHead;
