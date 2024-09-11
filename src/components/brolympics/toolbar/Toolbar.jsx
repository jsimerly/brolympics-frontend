import { useState } from "react";
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

  const PageButton = ({ route, text, icon, path }) => (
    <div
      onClick={() => handleIconClick(route)}
      className={`${
        pathRoute === path && "text-primary"
      } flex flex-col items-center justify-center flex-1`}
    >
      {icon}
      <span className="text-[10px]">{text}</span>
    </div>
  );
  return (
    <>
      <div className="h-[60px] -z-20" />
      <div className="fixed bottom-0 left-0 h-[60px] bg-neutral w-full border-t border-neutralLight flex justify-around items-center px-3">
        <PageButton
          route="home"
          text="Home"
          path="home"
          icon={<HomeOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route={`team/${default_team_uuid || `team/`}`}
          path="team"
          text="Teams"
          icon={<PeopleAltOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route={`event/${default_event_type}/${default_event_uuid || ""}`}
          text="Events"
          path="event"
          icon={<ScoreboardOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        <PageButton
          route="standings"
          text="Standings"
          path="standings"
          icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 30 }} />}
        />
        {is_owner && (
          <PageButton
            route="manage"
            text="Manage"
            path="manage"
            icon={<SettingsSuggestIcon sx={{ fontSize: 30 }} />}
          />
        )}
      </div>
    </>
  );
};

export default Toolbar;
