import BracketNode from "./BracketNode";

/** A real tournament tree for one knockout stage. Pure-CSS bracket: every
 * match takes equal flex space in its round column; odd/even matches draw
 * half-height elbows that meet exactly at the next round's match center.
 * The third-place game (final round, slot 1) renders below the tree. */
const Bracket = ({ nodes = [], is_complete }) => {
  const rounds = [...new Set(nodes.map((n) => n.round))].sort((a, b) => a - b);
  if (rounds.length === 0) return null;
  const lastRound = rounds[rounds.length - 1];
  const third = nodes.find((n) => n.round === lastRound && n.slot === 1);
  const treeNodes = nodes.filter((n) => n !== third);

  const roundLabel = (round) =>
    round === lastRound
      ? "Finals"
      : round === lastRound - 1
      ? "Semifinals"
      : `Round ${round}`;

  return (
    <div className="px-4 pb-6">
      <h2 className="mb-4 header-3">Bracket</h2>
      <div className="pb-2 overflow-x-auto">
        <div className="flex pt-1" style={{ minWidth: rounds.length * 236 }}>
          {rounds.map((round) => {
            const matches = treeNodes
              .filter((n) => n.round === round)
              .sort((a, b) => a.slot - b.slot);
            return (
              <div className="flex flex-col flex-1" key={round}>
                <h4 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
                  {roundLabel(round)}
                </h4>
                <ul className="brkt-round">
                  {matches.map((node) => (
                    <li
                      className={`brkt-match ${
                        round !== lastRound ? "brkt-feeds" : ""
                      } ${round !== rounds[0] ? "brkt-fed" : ""}`}
                      key={`${node.round}_${node.slot}`}
                    >
                      <div className="relative z-10 bg-white rounded-md">
                        <BracketNode contest={node.contest} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {third && (
        <div className="pt-2">
          <h4 className="pb-2 text-xs font-semibold tracking-wide uppercase text-light">
            Third Place
          </h4>
          <BracketNode contest={third.contest} />
        </div>
      )}
      <style>{`
        .brkt-round {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .brkt-match {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
          padding: 6px 24px 6px 0;
        }
        /* elbow out: odd matches drop down, even matches rise up, meeting
           at the boundary between them = the next match's center */
        .brkt-feeds:nth-child(odd)::after {
          content: "";
          position: absolute;
          right: 8px;
          top: 50%;
          bottom: 0;
          width: 8px;
          border-top: 2px solid #d1d5db;
          border-right: 2px solid #d1d5db;
        }
        .brkt-feeds:nth-child(even)::after {
          content: "";
          position: absolute;
          right: 8px;
          top: 0;
          bottom: 50%;
          width: 8px;
          border-bottom: 2px solid #d1d5db;
          border-right: 2px solid #d1d5db;
        }
        /* stub in: from the elbow junction into this match */
        .brkt-fed::before {
          content: "";
          position: absolute;
          left: -16px;
          top: 50%;
          width: 16px;
          border-top: 2px solid #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default Bracket;
