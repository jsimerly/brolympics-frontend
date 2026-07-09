import GroupIcon from "@mui/icons-material/Group";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const TeamEvent = ({ event }) => {
  const avg = !!event?.config?.display_avg_scores;
  return (
    <div className="text-sm">
      <p className="leading-relaxed text-light">
        Your team competes together toward one score — not against another team
        directly. Teams are ranked{" "}
        {event?.is_high_score_wins === false ? "lowest" : "highest"} first
        {avg ? ", using the average across games." : "."}
      </p>

      <ul className="mt-3 space-y-2">
        {[
          [GroupIcon, "One result per team, earned together."],
          [
            EqualizerIcon,
            avg
              ? "Multiple games average into the team result."
              : "Multiple games add up into the team result.",
          ],
          [CompareArrowsIcon, "Team results rank against the other teams."],
        ].map(([Icon, text], i) => (
          <li className="flex items-center gap-2" key={i}>
            <Icon sx={{ fontSize: 18 }} className="text-primary shrink-0" />
            <span className="text-light">{text}</span>
          </li>
        ))}
      </ul>

      <div className="p-3 mt-4 border-l-4 rounded border-secondary bg-secondary/5">
        <h4 className="font-semibold">Ties</h4>
        <p className="text-light">
          Teams with the same score share the rank and split the points — two
          teams tied for 1st and 2nd get (12 + 10) / 2 = 11 points each.
        </p>
      </div>
    </div>
  );
};

export default TeamEvent;
