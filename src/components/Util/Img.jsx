import { useState } from "react";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const icons = {
  team: FlagOutlinedIcon,
  player: PersonOutlineIcon,
  event: EmojiEventsOutlinedIcon,
  brolympics: EmojiEventsOutlinedIcon,
  league: GroupsOutlinedIcon,
};

/** An <img> that degrades to a neutral placeholder (kind-appropriate icon on
 * a soft background) when the source is missing or fails to load. Size it via
 * className exactly like an img. One place to make the placeholders cute. */
const Img = ({ src, alt = "", kind = "team", className = "" }) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    const Icon = icons[kind] || icons.team;
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className}`}
        aria-label={alt}
      >
        <Icon sx={{ width: "60%", height: "60%" }} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
};

export default Img;
