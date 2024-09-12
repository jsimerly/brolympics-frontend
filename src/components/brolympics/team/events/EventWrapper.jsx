import { useState } from "react";

import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

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
  const handleClick = () => {
    setOpen((isOpen) => !isOpen);
  };

  return (
    <div className={`px-6`}>
      <div
        className={`flex justify-between w-full h-full py-3`}
        onClick={handleClick}
      >
        <div className="w-2/5">
          <h3 className="font-bold">{name}</h3>
          <span>{display_score}</span>
        </div>
        {(is_active || is_final) && (
          <div className="flex items-center w-2/5">
            <div className="flex items-center w-1/2 gap-2">
              <NumbersOutlinedIcon /> {rank}
            </div>
            <div className="flex items-center w-1/2 gap-2">
              <DiamondOutlinedIcon />{" "}
              {Number.isInteger(points) ? points : points.toFixed(1)}
            </div>
          </div>
        )}
        <div className="flex items-center">
          {isOpen ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
        </div>
      </div>
      {isOpen && children}
    </div>
  );
};

export default EventWrapper;
