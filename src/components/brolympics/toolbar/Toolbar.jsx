import { useNavigate, useLocation, useParams } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

const Toolbar = ({
  status,
  is_owner,
  default_team_uuid,
  default_event_uuid,
  default_event_type,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathAfterBrolympics = pathname;
  let pathRoute = "";
  try {
    pathRoute = pathAfterBrolympics.split("/")[3];
  } catch (error) {
    if (error instanceof IndexError) {
      pathRoute = "";
    } else {
      throw error;
    }
  }

  const { uuid } = useParams();

  const handleIconClick = (route) => {
    navigate(`/b/${uuid}/${route}`);
  };

  const PageButton = ({ route, text, icon, path, sx }) => (
    <div
      onClick={() => handleIconClick(route)}
      className={`${
        pathRoute === path && `${sx}`
      } flex flex-col items-center justify-center flex-1`}
    >
      {icon}
      <span className="text-[10px]">{text}</span>
    </div>
  );
  return (
    <>
      <div className="h-[60px] -z-20 bg-white" />
      <div className="fixed bottom-0 left-0 h-[60px] bg-white w-full border-t flex justify-around items-center px-3">
        <PageButton
          route="home"
          text="Home"
          path="home"
          sx="text-primary"
          icon={<HomeOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route={`team/${default_team_uuid || ""}`}
          path="team"
          text="Teams"
          sx="text-tertiary"
          icon={<PeopleAltOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route={`event/${default_event_type}/${default_event_uuid || ""}`}
          text="Events"
          path="event"
          sx="text-secondary"
          icon={<ScoreboardOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route="standings"
          text="Standings"
          path="standings"
          sx="text-red"
          icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        {is_owner && (
          <PageButton
            route="manage"
            text="Manage"
            path="manage"
            color="text-purple-500"
            icon={<SettingsSuggestIcon sx={{ fontSize: 30 }} />}
          />
        )}
      </div>
    </>
  );
};

export default Toolbar;
