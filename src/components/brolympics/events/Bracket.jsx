import BracketNode from "./BracketNode";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

/** Renders one knockout stage from the bracket endpoint payload:
 * { stage, is_complete, nodes: [{round, slot, winner_to, loser_to, contest}] }.
 * Nodes are grouped by round into columns; any bracket size works. */
const Bracket = ({ nodes = [], is_complete }) => {
  const rounds = [...new Set(nodes.map((n) => n.round))].sort((a, b) => a - b);
  if (rounds.length === 0) return null;
  const lastRound = rounds[rounds.length - 1];

  const roundLabel = (round) => {
    if (round === lastRound) return "Finals";
    if (round === lastRound - 1) return "Semifinals";
    return `Round ${round}`;
  };

  return (
    <div className="px-6 pb-6 overflow-auto">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-[20px]">Bracket</h2>
        {!is_complete && <PriorityHighIcon className="text-secondary" />}
      </div>
      <div className="flex items-start gap-8 pt-2">
        {rounds.map((round) => (
          <div key={round} className="flex flex-col justify-around h-full">
            <h4 className="text-[12px] pb-2">{roundLabel(round)}</h4>
            <div className="flex flex-col justify-around flex-grow gap-6">
              {nodes
                .filter((n) => n.round === round)
                .map((node) => (
                  <BracketNode
                    key={`${node.round}_${node.slot}`}
                    contest={node.contest}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
