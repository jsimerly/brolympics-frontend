import PersonIcon from "@mui/icons-material/Person";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const Individual = ({ event }) => {
  const avg = !!event?.config?.display_avg_scores;
  return (
    <div className="text-sm">
      <p className="leading-relaxed text-light">
        Everyone posts their own score, independent of their teammates. Your
        team's result is the {avg ? "average" : "combined total"} of its
        players' scores, and teams are ranked{" "}
        {event?.is_high_score_wins === false ? "lowest" : "highest"} first.
      </p>

      <ul className="mt-3 space-y-2">
        {[
          [PersonIcon, "Compete solo — every score counts toward the team."],
          [
            EqualizerIcon,
            avg
              ? "Team result: the average of its players' scores."
              : "Team result: all players' scores added together.",
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

export default Individual;
