import { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SEARCH_THRESHOLD = 8;

/** The horizontal pill switcher (events, teams). Past the threshold a search
 * pill appears up front — type-to-jump beats flicking through twenty pills.
 * Picking a match clears the search so the bar snaps back to normal. */
const PillBar = ({ items = [], selectedId, onSelect }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const searchable = items.length > SEARCH_THRESHOLD;

  const shown = useMemo(() => {
    if (!searching || !query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((item) => (item.name || "").toLowerCase().includes(q));
  }, [items, searching, query]);

  const closeSearch = () => {
    setSearching(false);
    setQuery("");
  };

  const pick = (item) => {
    onSelect(item);
    closeSearch();
  };

  return (
    <div
      className="flex gap-2 px-2 py-3 -mx-2 overflow-x-auto"
      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
    >
      {searchable &&
        (searching ? (
          <span className="flex items-center gap-1 pl-3 pr-2 bg-white border rounded-full border-primary shrink-0">
            <SearchIcon sx={{ fontSize: 16 }} className="text-light" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to..."
              className="w-24 text-sm outline-none"
            />
            <button onClick={closeSearch} className="text-light" title="Close search">
              <CloseIcon sx={{ fontSize: 16 }} />
            </button>
          </span>
        ) : (
          <button
            className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-full shrink-0 text-light"
            onClick={() => setSearching(true)}
            title="Jump to..."
          >
            <SearchIcon sx={{ fontSize: 18 }} />
          </button>
        ))}
      {shown.map((item) => (
        <button
          key={item.uuid}
          onClick={() => pick(item)}
          className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full border transition-colors shrink-0 ${
            item.uuid === selectedId
              ? "bg-primary text-white border-primary"
              : "bg-white text-near-black border-gray-200"
          } ${item.dimmed ? "line-through opacity-50" : ""}`}
        >
          {item.name}
        </button>
      ))}
      {shown.length === 0 && (
        <span className="py-2 text-sm text-light">No matches.</span>
      )}
    </div>
  );
};

export default PillBar;
