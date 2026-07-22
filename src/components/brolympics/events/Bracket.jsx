import BracketNode from "./BracketNode";
import { groupBracketNodes, placeLabel } from "./eventDisplay";
import Gold from "../../../assets/svgs/gold.svg";
import Img from "../../Util/Img";

/** Tournament trees for one knockout stage. Nodes group by which terminal
 * game their winner_to chain reaches: the championship tree, then any
 * classification pools (5th–8th run-offs), with single placement games
 * (3rd, 7th) rendered as standalone labeled matches. Pure-CSS elbows. */
const Bracket = ({ nodes = [] }) => {
  if (!nodes.length) return null;
  const ordered = groupBracketNodes(nodes);

  const Tree = ({ members }) => {
    const rounds = [...new Set(members.map((n) => n.round))].sort(
      (a, b) => a - b
    );
    const firstRound = rounds[0];
    const lastRound = rounds[rounds.length - 1];
    return (
      <div className="pb-2 overflow-x-auto">
        <div className="flex pt-1" style={{ minWidth: rounds.length * 236 }}>
          {rounds.map((round) => (
            <div className="flex flex-col flex-1" key={round}>
              <ul className="brkt-round">
                {members
                  .filter((n) => n.round === round)
                  .sort((a, b) => a.slot - b.slot)
                  .map((node) => (
                    <li
                      className={`brkt-match ${
                        round !== lastRound ? "brkt-feeds" : ""
                      } ${round !== firstRound ? "brkt-fed" : ""}`}
                      key={`${node.round}_${node.slot}`}
                    >
                      <div className="relative z-10 bg-white rounded-md">
                        <BracketNode contest={node.contest} />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 pb-6 space-y-4">
      {ordered.map(({ terminal, members }) => {
        const p = terminal.decides_place;
        const span = p ? `${p}–${p + members.length}` : "";
        const title =
          p === 1
            ? "Bracket"
            : members.length > 1
            ? `Places ${span}`
            : placeLabel(p);
        // showcase the pool's decision once its terminal game is in
        const winner = terminal.contest?.is_complete
          ? (terminal.contest.entries || []).find((e) => e.outcome === "w")
          : null;
        return (
          <div key={`${terminal.round}_${terminal.slot}`}>
            <h2 className={p === 1 ? "mb-2 header-3" : "pb-2 text-xs font-semibold tracking-wide uppercase text-light"}>
              {title}
            </h2>
            {p === 1 && winner && (
              <div className="flex items-center gap-3 p-3 mb-3 border rounded-lg border-secondary/40 bg-secondary/5">
                <img src={Gold} alt="" className="h-6 shrink-0" />
                <Img
                  src={winner.team_img}
                  alt={winner.team_name}
                  kind="team"
                  className="object-cover w-10 h-10 rounded-lg shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-light">
                    Bracket Champion
                  </span>
                  <span className="font-bold leading-tight truncate">
                    {winner.team_name}
                  </span>
                </div>
              </div>
            )}
            {p > 1 && winner && (
              <p className="pb-2 -mt-1 text-xs text-light">
                <span className="font-semibold text-near-black">
                  {winner.team_name}
                </span>{" "}
                took {placeLabel(p)}
              </p>
            )}
            {members.length > 1 ? (
              <Tree members={members} />
            ) : (
              <BracketNode contest={terminal.contest} />
            )}
          </div>
        );
      })}
      <style>{`
        .brkt-round { display:flex; flex-direction:column; flex-grow:1; list-style:none; margin:0; padding:0; }
        .brkt-match { display:flex; align-items:center; flex:1; position:relative; padding:6px 24px 6px 0; }
        .brkt-feeds:nth-child(odd)::after { content:""; position:absolute; right:8px; top:50%; bottom:0; width:8px; border-top:2px solid #d1d5db; border-right:2px solid #d1d5db; }
        .brkt-feeds:nth-child(even)::after { content:""; position:absolute; right:8px; top:0; bottom:50%; width:8px; border-bottom:2px solid #d1d5db; border-right:2px solid #d1d5db; }
        .brkt-fed::before { content:""; position:absolute; left:-16px; top:50%; width:16px; border-top:2px solid #d1d5db; }
      `}</style>
    </div>
  );
};

export default Bracket;
