import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCreateSingleTeam,
  fetchDeleteTeam,
  fetchRemovePlayer,
  fetchUpdateTeamImage,
} from "../../../api/team.js";
import { getInviteLinkTeam } from "../../../api/invites.js";
import PopupContinue from "../../Util/PopupContinue.jsx";
import CopyWrapper from "../../Util/CopyWrapper.jsx";
import ImageCropper, { readImageFile } from "../../Util/ImageCropper.jsx";
import { useNotification } from "../../Util/Notification.jsx";
import Schedule from "./Schedule.jsx";

const OwnTeamCard = ({ name, img, player_1, player_2, uuid }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [teamName, setTeamName] = useState(name);
  const handleTeamNameChange = (e) => setTeamName(e.target.value);
  const { showNotification } = useNotification();

  const [imgSrc, setImgSrc] = useState(null);
  const [savedImg, setSavedImg] = useState(img);
  const [cropping, setCropping] = useState(false);

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readImageFile(file);

      setImgSrc(imageDataUrl);
      setCropping(true);
    }
  };

  const setCroppedImage = async (croppedImage) => {
    setSavedImg(croppedImage);
    setCropping(false);

    const response = await fetchUpdateTeamImage(croppedImage, uuid);
    if (response.ok) {
      showNotification(
        "Your team's image has been udpated.",
        "!border-primary"
      );
    } else {
      showNotification(
        "There was an issue when trying to upload your image. Please make sure your image is below 500kb."
      );
    }
  };

  const handleCloseCropper = () => {
    setCropping(false);
  };

  const get_name_size = (name) => {
    if (name) {
      if (name.length <= 14) {
        return "26px";
      } else if (name.length <= 16) {
        return "26px";
      } else if (name.length <= 24) {
        return "22px";
      } else {
        return "18px";
      }
    }
  };

  const onEditClick = () => {
    setEditOpen((editOpen) => !editOpen);
  };

  const [popupTeamOpen, setPopupTeamOpen] = useState(false);
  const [popupPlayerOpen, setPopupPlayerOpen] = useState(false);
  const [removePlayer, setRemovePlayer] = useState();

  const onRemovePlayer = (player) => {
    setRemovePlayer(player);
    setPopupPlayerOpen(true);
  };

  const removePlayerFunc = async () => {
    const response = await fetchRemovePlayer(removePlayer.uuid, uuid);
    if (response.ok) {
      location.reload();
    }
  };

  const deleteClicked = () => {
    setPopupTeamOpen(true);
  };

  const deleteTeamFunc = async () => {
    const response = await fetchDeleteTeam(uuid);
    if (response.ok) {
      location.reload();
    }
  };

  return (
    <div className="relative flex items-start w-full gap-3 p-3 border rounded-md border-primary">
      <input
        type="file"
        accept="image/*"
        id="file_team"
        onChange={handleImageUpload}
        hidden
      />
      <label
        htmlFor="file_team"
        className="inline-flex bg-white rounded-md cursor-pointer"
      >
        {savedImg ? (
          <img src={savedImg} className="rounded-md w-[80px] h-[80px]" />
        ) : (
          <div className="w-[100px] h-[100px] rounded-md flex items-center justify-center">
            <CameraAltIcon
              className="bg-white w-[100px] text-neutral"
              sx={{ fontSize: 60 }}
            />
          </div>
        )}
      </label>
      {cropping && (
        <ImageCropper
          img={imgSrc}
          setCroppedImage={setCroppedImage}
          handleCloseCropper={handleCloseCropper}
        />
      )}

      {editOpen ? (
        <div className="">
          <div className="relative">
            <input
              className="p-2 my-1 rounded-md bg-neutralLight"
              value={teamName}
              onChange={handleTeamNameChange}
            />
            <SaveIcon className="absolute right-2 top-3 text-primary" />
          </div>
          {player_1 && (
            <div>
              <button onClick={() => onRemovePlayer(player_1)}>
                <RemoveIcon className="text-errorRed" />
                {player_1.full_name}
              </button>
            </div>
          )}
          {player_2 && (
            <div>
              <button onClick={() => onRemovePlayer(player_2)}>
                <RemoveIcon className="text-errorRed" />
                {player_2.full_name}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <h2
            className={`text-[${get_name_size(
              name
            )}] font-semibold leading-none`}
          >
            {name}
          </h2>
          <span className="text-sm">{player_1 && player_1.full_name}</span>
          <span className="text-sm">{player_2 && player_2.full_name}</span>
        </div>
      )}

      <button className="absolute top-2 right-2" onClick={onEditClick}>
        {editOpen ? <CloseIcon /> : <EditIcon />}
      </button>
      {editOpen && (
        <button
          className="absolute px-1 rounded-md bottom-2 right-2 bg-errorRed"
          onClick={deleteClicked}
        >
          Delete Team
        </button>
      )}
      {!editOpen && !(player_1 && player_2) && (
        <div className="absolute px-1 py-0 bottom-2 right-2 primary-btn">
          <CopyWrapper copyString={getInviteLinkTeam(uuid)} size={20}>
            <span className="mr-1 text-sm">Copy Invite Link</span>
          </CopyWrapper>
        </div>
      )}
      <div className="text-neutralDark">
        <PopupContinue
          open={popupTeamOpen}
          setOpen={setPopupTeamOpen}
          header={"Delete this Team?"}
          desc={"Doing this will perminately delete this team."}
          continueText={"Delete"}
          continueFunc={deleteTeamFunc}
        />
        <PopupContinue
          open={popupPlayerOpen}
          setOpen={setPopupPlayerOpen}
          header={`Remove ${
            removePlayer && removePlayer.full_name
          } from this team?`}
          desc={`Doing this will perminately remove ${
            removePlayer && removePlayer.first_name
          }. If you do, you can always add them back to the team later.`}
          continueText={"Delete"}
          continueFunc={removePlayerFunc}
        />
      </div>
    </div>
  );
};

const TeamCard = ({ broUuid, team }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(`/b/${broUuid}/team/${team.uuid}`);
  };

  return (
    <button
      className="flex items-center w-full p-4 space-x-4 card"
      onClick={handleSelect}
    >
      <img src={team.img} className="object-cover w-16 h-16 rounded-md" />
      <div className="">
        <h3 className="text-xl font-semibold`">{team.name}</h3>
        <div className="text-sm text-light">
          <div>{team.player_1 && team.player_1.full_name}</div>
          <div>{team.player_2 && team.player_2.full_name}</div>
        </div>
      </div>
    </button>
  );
};

const HomePre = ({
  events,
  img,
  is_owner,
  projected_start_date,
  projected_end_date,
  teams,
  user_team,
}) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamImg, setNewTeamImg] = useState();
  const [cropping, setCropping] = useState(false);
  const onTeamNameChange = (e) => setNewTeamName(e.target.value);
  const { uuid } = useParams();
  const { showNotification } = useNotification();

  const onCreateTeamClick = async () => {
    try {
      const data = await fetchCreateSingleTeam(newTeamName, uuid, true);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification(
        "There was an error when attempting to create this team."
      );
    }
  };

  return (
    <div className="p-2 space-y-8">
      <div>
        {user_team ? (
          <OwnTeamCard {...user_team} />
        ) : (
          <div className="p-6 space-y-4 bg-white rounded-md shadow-md">
            <h3 className="text-2xl font-bold text-primary">
              Create Your Team
            </h3>
            <div>
              <label
                htmlFor="teamName"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Team Name
              </label>
              <input
                id="teamName"
                className="w-full p-2 text-lg border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                value={newTeamName}
                onChange={onTeamNameChange}
                placeholder="Enter your team name"
              />
            </div>
            <div>
              <h3 className="block mb-1 text-sm font-medium text-gray-700">
                Upload a Logo{" "}
                <span className="text-xs text-gray-500">(Optional)</span>
              </h3>
              <input
                type="file"
                accept="image/*"
                id="file_league"
                onChange={handleImageUpload}
                hidden
              />
              <label
                htmlFor="file_league"
                className="inline-flex transition-colors duration-200 border rounded-md cursor-pointer"
              >
                {newTeamImg ? (
                  <img
                    src={newTeamImg}
                    className="object-cover w-24 h-24 rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 rounded-md">
                    <CameraAltIcon
                      className="text-gray-400"
                      sx={{ fontSize: 40 }}
                    />
                  </div>
                )}
              </label>
              {cropping && (
                <ImageCropper
                  img={league.imgSrc}
                  setCroppedImage={setCroppedImage}
                />
              )}
            </div>
            <button
              className="w-full p-3 text-xl font-semibold text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark"
              onClick={onCreateTeamClick}
            >
              Create Team
            </button>
          </div>
        )}
      </div>
      <div className="">
        <div className="space-y-2">
          {events && events.length > 0 ? (
            <Schedule events={events} />
          ) : (
            <p className="text-light">No events have been registered yet.</p>
          )}
        </div>
      </div>
      <div className="">
        <h2 className="mb-4 text-2xl font-bold text-tertiary">Other Teams</h2>
        <div className="space-y-2">
          {teams && teams.length > 0 ? (
            teams.map(
              (team, i) =>
                team.uuid !== user_team.uuid && (
                  <TeamCard broUuid={uuid} team={team} key={i + "_teamCard"} />
                )
            )
          ) : (
            <p className="text-light">No teams have been registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePre;
