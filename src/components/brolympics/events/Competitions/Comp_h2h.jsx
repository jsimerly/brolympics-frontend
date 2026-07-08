const Comp_h2h = ({ entries = [], is_complete }) => {
  const [entry_1, entry_2] = entries;

  const getFontSize = (name) => {
    if (name) {
      if (name.length <= 10) {
        return "16px";
      } else if (name.length <= 16) {
        return "14px";
      } else if (name.length <= 20) {
        return "12px";
      } else {
        return "10px";
      }
    }
  };

  const winStyle = (entry) =>
    entry?.outcome === "w" ? "font-bold text-primaryLight" : "";

  return (
    <div className={`flex items-center justify-center py-3 px-6`}>
      <div className="flex items-center justify-center w-full">
        <div
          className={`w-2/5 ${winStyle(entry_1)}`}
          style={{ fontSize: getFontSize(entry_1?.team_name) }}
        >
          {entry_1?.team_name || "TBD"}
        </div>
        <div className="w-1/5 text-center">
          {is_complete ? (
            <>
              <span className={winStyle(entry_1)}>{entry_1?.score}</span>
              <span className="px-1">:</span>
              <span className={winStyle(entry_2)}>{entry_2?.score}</span>
            </>
          ) : (
            "vs"
          )}
        </div>
        <div
          className={`w-2/5 ${winStyle(entry_2)} text-end`}
          style={{ fontSize: getFontSize(entry_2?.team_name) }}
        >
          {entry_2?.team_name || "TBD"}
        </div>
      </div>
    </div>
  );
};

export default Comp_h2h;
