import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import ScaleIcon from "@mui/icons-material/Scale";

export const TIEBREAKER_META = {
  wins: ["Wins", EmojiEventsIcon, "Most games won."],
  ties: ["Ties", HandshakeOutlinedIcon, "More ties ranks higher among equal wins."],
  h2h: ["Head-to-head", SportsKabaddiIcon, "Wins in the games between the tied teams."],
  sov: ["Strength of victory", MilitaryTechOutlinedIcon, "Your beaten opponents' win totals."],
  sos: ["Strength of schedule", BarChartIcon, "All your opponents' win totals."],
  diff: ["Point margin", ScaleIcon, "Total score difference (capped per game when the event sets a cap)."],
};

const DEFAULT_ORDER = ["wins", "ties", "h2h", "sov", "sos", "diff"];

const HeadToHead = ({ event }) => {
  const stages = event?.stages || [];
  const rr = stages.find((s) => s.structure === "round_robin");
  const swiss = stages.find((s) => s.structure === "swiss");
  const ko = stages.find((s) => s.structure === "knockout");
  const games = rr?.config?.games_per_team ?? swiss?.config?.rounds;
  const take = ko?.config?.take;
  const order = event?.config?.tiebreakers ?? DEFAULT_ORDER;

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

      <h3 className="pt-4 pb-1 font-semibold">Ranking & tiebreakers</h3>
      <p className="pb-2 text-light">
        Group standings apply these in order — each one only sorts teams the
        previous ones left tied. Still tied after all of them? The teams share
        the rank and split the points.
      </p>
      <ol className="overflow-hidden bg-white border border-gray-200 rounded-lg divide-y">
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
      </ol>
      <p className="pt-2 text-[11px] text-light">
        Commissioners can customize this order per event in Manage → Events.
      </p>
    </div>
  );
};

export default HeadToHead;
