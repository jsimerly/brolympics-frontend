/** Roster display: one or two players read naturally ("A & B"); three or
 * more stack vertically instead of running into an ampersand chain. */
const PlayerNames = ({ players = [], className = "" }) => {
  if (!players.length) return null;
  if (players.length <= 2) {
    return <span className={className}>{players.join(" & ")}</span>;
  }
  return (
    <span className={`flex flex-col ${className}`}>
      {players.map((player) => (
        <span className="leading-tight" key={player}>
          {player}
        </span>
      ))}
    </span>
  );
};

export default PlayerNames;
