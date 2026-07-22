import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PopupContinue from "../../Util/PopupContinue";
import { endBrolympics } from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

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

const Manage = ({ is_active }) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { showNotification } = useNotification();
  const [endOpen, setEndOpen] = useState(false);

  const endBro = async () => {
    try {
      await endBrolympics(uuid);
      // full load: home, standings, and the hamburger all flip to post-game
      window.location.href = `/b/${uuid}/home`;
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "There was an error ending the Brolympics.")
      );
    }
  };

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

      {is_active && (
        <div className="p-3 mt-2 border rounded-lg border-red/30">
          <h4 className="text-sm font-semibold text-red">End the Brolympics</h4>
          <p className="text-[11px] text-light">
            It ends on its own when the last event wraps — this is the early
            exit. Standings freeze where they sit, events close, and open
            games go away.
          </p>
          <button
            className="w-full py-2 mt-2 text-sm font-semibold border rounded-full text-red border-red"
            onClick={() => setEndOpen(true)}
          >
            End Brolympics
          </button>
        </div>
      )}

      <PopupContinue
        open={endOpen}
        setOpen={setEndOpen}
        header="End the Brolympics?"
        desc="The games are over: standings freeze, events close, and unplayed games go away. There's no restart button."
        continueText="End it"
        continueFunc={endBro}
      />
    </div>
  );
};

export default Manage;
