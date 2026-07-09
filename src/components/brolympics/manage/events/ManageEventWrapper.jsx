import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const STATE_CHIP = {
  live: ["Live", "bg-tertiary/10 text-tertiary"],
  done: ["Done", "bg-gray-100 text-light"],
  cancelled: ["Cancelled", "bg-red/10 text-red"],
};

const ManageEventWrapper = ({ name, event, children }) => {
  const [open, setOpen] = useState(false);
  const chip = event?.is_cancelled
    ? STATE_CHIP.cancelled
    : event?.is_complete
    ? STATE_CHIP.done
    : event?.is_active
    ? STATE_CHIP.live
    : null;

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <button
        className="flex items-center justify-between w-full gap-2 p-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center min-w-0 gap-2">
          <span className="font-semibold truncate">{name}</span>
          {chip && (
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${chip[1]}`}
            >
              {chip[0]}
            </span>
          )}
        </span>
        {open ? (
          <ExpandLessIcon className="shrink-0 text-light" />
        ) : (
          <ExpandMoreIcon className="shrink-0 text-light" />
        )}
      </button>
      {open && <div className="p-3 border-t border-gray-100">{children}</div>}
    </div>
  );
};

export default ManageEventWrapper;
