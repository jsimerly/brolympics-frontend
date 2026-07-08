import { useState } from "react";

import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import Gold from "../../../../assets/svgs/gold.svg";
import Silver from "../../../../assets/svgs/silver.svg";
import Bronze from "../../../../assets/svgs/bronze.svg";

const medalFor = { 1: Gold, 2: Silver, 3: Bronze };

/** One event row on the team page: name + record on the left, rank/points on
 * the right (medal for podium finishes), tap to expand the game log. */
const EventWrapper = ({
  name,
  rank,
  points,
  display_score,
  is_active,
  is_final,
  children,
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <div
        className="flex items-center justify-between w-full py-3 cursor-pointer"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="flex flex-col">
          <h3 className="font-bold leading-tight">
            {name}
            {is_active && (
              <span className="ml-2 text-[10px] font-semibold text-secondary uppercase">
                live
              </span>
            )}
          </h3>
          {display_score !== "" && display_score != null && (
            <span className="text-sm text-light">{display_score}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {rank != null && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border rounded-full">
              {rank <= 3 && is_final ? (
                <img src={medalFor[rank]} alt="" className="h-3.5" />
              ) : (
                "#"
              )}
              {rank}
            </span>
          )}
          {points != null && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-white border rounded-full">
              {Number.isInteger(points) ? points : points.toFixed(1)} pts
            </span>
          )}
          {isOpen ? (
            <ExpandLessOutlinedIcon className="text-light" />
          ) : (
            <ExpandMoreOutlinedIcon className="text-light" />
          )}
        </div>
      </div>
      {isOpen && children}
    </div>
  );
};

export default EventWrapper;
