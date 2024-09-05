import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchCreateSingleTeam,
  fetchDeleteTeam,
  fetchRemovePlayer,
} from "../../../api/team.js";
import { getInviteLinkTeam } from "../../../api/invites.js";
import PopupContinue from "../../Util/PopupContinue.jsx";
import SaveIcon from "@mui/icons-material/Save";
import CopyWrapper from "../../Util/CopyWrapper.jsx";
import { useParams } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageCropper, { readImageFile } from "../../Util/ImageCropper.jsx";
import { fetchUpdateTeamImage } from "../../../api/team.js";
import { useNotification } from "../../Util/Notification.jsx";

const EventCard = ({
  name,
  projected_end_date,
  projected_start_date,
  n_matches,
  n_bracket_teams,
  n_competitions,
}) => {
  return (
    <div className="flex justify-between w-full py-2 text-white">
      <div className="text-[20px]">{name}</div>
      <div className="flex space-x-3 text-[12px] items-center">
        {n_matches && `Matches: ${n_matches}`}
        {n_competitions && `Competitions: ${n_competitions}`}
      </div>
    </div>
  );
};

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
    try {
      const data = await fetchUpdateTeamImage(croppedImage, uuid);
      showNotification(
        "Your team's image has been udpated.",
        "!border-primary"
      );
    } catch (error) {
      console.log(error);
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
        return "30px";
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
    try {
      const data = await fetchRemovePlayer(removePlayer.uuid, uuid);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification(
        "There was an error while attempting to remove this player."
      );
    }

    if (response.ok) {
    }

    const deleteClicked = () => {
      setPopupTeamOpen(true);
    };

    const deleteTeamFunc = async () => {
      try {
        const data = await fetchDeleteTeam(uuid);
        location.reload();
      } catch (error) {
        console.log(error);
        showNotification(
          "There was an error while attempting to delete this team."
        );
      }
    };

    return (
      <div className="relative flex items-center w-full gap-3 p-3 border rounded-md border-primary">
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
          <div className="flex flex-col">
            <h2 className={`text-[${get_name_size(name)}] font-semibold`}>
              {name}
            </h2>
            <span>{player_1 && player_1.full_name}</span>
            <span>{player_2 && player_2.full_name}</span>
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
          <div className="absolute bottom-2 right-2 bg-primary text-[12px] p-1 rounded-md flex items-center gap-1">
            <CopyWrapper copyString={getInviteLinkTeam(uuid)} size={20}>
              <span className="mr-1">Copy Invite Link</span>
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
};

const TeamCard = ({ name, img, player_1, player_2 }) => {
  return (
    <div className="flex items-center p-2 space-x-3">
      <img src={img} className="h-[60px] w-[60px] rounded-md" />
      <div className="">
        <h3 className="text-[20px] font-semibold">{name}</h3>
        <div className="text-[14px]">
          <div>{player_1 && player_1.full_name}</div>
          <div>{player_2 && player_2.full_name}</div>
        </div>
      </div>
    </div>
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

  const handleImageUpload = () => {};

  return (
    <div className="p-6 space-y-3">
      <div>
        {user_team ? (
          <OwnTeamCard {...user_team} />
        ) : (
          <div className="space-y-2">
            <h3>Name</h3>
            <input
              className="w-full bg-neutralLight text-[18px] p-2 rounded-md"
              value={newTeamName}
              onChange={onTeamNameChange}
              placeholder="Team Name"
            />
            <div>
              <h3 className="ml-1">
                Upload a Logo <span className="text-[12px]"> (Optional)</span>
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
                className="inline-flex border rounded-md cursor-pointer border-neutralLight"
              >
                {newTeamImg ? (
                  <img src={newTeamImg} className="max-w-[100px] rounded-md" />
                ) : (
                  <div className="w-[100px] h-[100px] rounded-md flex items-center justify-center">
                    <CameraAltIcon
                      className="w-[100px] text-neutralLight"
                      sx={{ fontSize: 60 }}
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
              className="w-full p-2 font-semibold rounded-md bg-primary text-[20px]"
              onClick={onCreateTeamClick}
            >
              Create Team
            </button>
          </div>
        )}
      </div>
      <div className="">
        <h2 className="text-[16px] font-bold">Events</h2>
        <div className="space-y-2">
          {events && events.length > 0
            ? events.map((event, i) => (
                <>
                  {i !== 0 && (
                    <div className="w-full h-[1px] bg-neutralLight" />
                  )}
                  <EventCard {...event} key={i + "_eventCard"} />
                </>
              ))
            : "No events have been registered yet."}
        </div>
      </div>
      <div className="">
        <h2 className="text-[16px] font-bold">Other Teams</h2>
        {teams && teams.length > 0
          ? teams.map(
              (team, i) =>
                team.uuid !== user_team.uuid && (
                  <TeamCard {...team} key={i + "_teamCard"} />
                )
            )
          : "No teams have been registered yet."}
      </div>
    </div>
  );
};

export default HomePre;
