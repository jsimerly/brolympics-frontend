import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const TOOLS = [
  {
    header: "Brolympics Settings",
    desc: "Name, logo, dates, and the invite link.",
    nav: "manage-brolympics",
    Icon: TuneOutlinedIcon,
  },
  {
    header: "Events",
    desc: "Rules, locations, scoring, structure — and adding new events.",
    nav: "manage-events",
    Icon: EmojiEventsOutlinedIcon,
  },
  {
    header: "Teams",
    desc: "Rosters, dormant players, invites, and removals.",
    nav: "manage-teams",
    Icon: GroupsOutlinedIcon,
  },
  {
    header: "Fix a Score",
    desc: "Correct any recorded game, event by event.",
    nav: "edit-competition",
    Icon: ScoreboardOutlinedIcon,
  },
  {
    header: "Fix a Bracket",
    desc: "Correct playoff results round by round.",
    nav: "edit-bracket",
    Icon: AccountTreeOutlinedIcon,
  },
];

const Manage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col max-w-md gap-2 mx-auto">
      <h2 className="pb-1 text-lg font-bold">Commissioner Tools</h2>
      {TOOLS.map(({ header, desc, nav, Icon }) => (
        <button
          key={nav}
          className="flex items-center w-full gap-3 p-3 text-left bg-white border border-gray-200 rounded-lg"
          onClick={() => navigate(nav)}
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10">
            <Icon className="text-primary" sx={{ fontSize: 22 }} />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="font-semibold leading-tight">{header}</span>
            <span className="text-xs text-light">{desc}</span>
          </span>
          <ChevronRightIcon className="ml-auto shrink-0 text-light" />
        </button>
      ))}
    </div>
  );
};

export default Manage;
