import { useNavigate, useLocation, useParams } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

/** Fixed bottom tab bar, native-app style: one accent color, filled icon on
 * the active tab, safe-area padding for phones with a home indicator. */
const Toolbar = ({
  is_owner,
  default_team_uuid,
  default_event_uuid,
  default_event_type,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { uuid } = useParams();
  const pathRoute = pathname.split("/")[3] || "";
  const savedTeam = localStorage.getItem(`selectedTeamUuid:${uuid}`);
  const savedEventUuid = localStorage.getItem(`selectedEventUuid:${uuid}`);
  const savedEventType = localStorage.getItem(`selectedEventType:${uuid}`);

  const tabs = [
    { route: "home", path: "home", text: "Home",
      Icon: HomeOutlinedIcon, ActiveIcon: HomeIcon },
    { route: `team/${savedTeam || default_team_uuid || ""}`,
      path: "team", text: "Teams",
      Icon: PeopleAltOutlinedIcon, ActiveIcon: PeopleAltIcon },
    { route: savedEventUuid
        ? `event/${savedEventType}/${savedEventUuid}`
        : `event/${default_event_type}/${default_event_uuid || ""}`,
      path: "event", text: "Events",
      Icon: ScoreboardOutlinedIcon, ActiveIcon: ScoreboardIcon },
    { route: "standings", path: "standings", text: "Standings",
      Icon: EmojiEventsOutlinedIcon, ActiveIcon: EmojiEventsIcon },
    ...(is_owner
      ? [{ route: "manage", path: "manage", text: "Manage",
           Icon: SettingsSuggestOutlinedIcon, ActiveIcon: SettingsSuggestIcon }]
      : []),
  ];

  return (
    <>
      <div className="h-[60px] pb-[env(safe-area-inset-bottom)]" />
      <nav className="fixed bottom-0 left-0 z-40 w-full bg-white border-t pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-around h-[60px] px-2">
          {tabs.map(({ route, path, text, Icon, ActiveIcon }) => {
            const active = pathRoute === path;
            const TabIcon = active ? ActiveIcon : Icon;
            return (
              <button
                key={path}
                onClick={() => navigate(`/b/${uuid}/${route}`)}
                className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-transform active:scale-95 ${
                  active ? "text-primary" : "text-gray-400"
                }`}
              >
                <TabIcon sx={{ fontSize: 26 }} />
                <span
                  className={`text-[10px] leading-none ${
                    active ? "font-semibold" : ""
                  }`}
                >
                  {text}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Toolbar;
