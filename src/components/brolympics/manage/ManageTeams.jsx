import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import CopyWrapper from "../../Util/CopyWrapper";
import PopupContinue from "../../Util/PopupContinue";
import Img from "../../Util/Img";

import {
  createTeam,
  deleteTeam,
  removePlayerFromTeam,
  setPlayerActive,
  updateTeamImage,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification.jsx";
import ImageCropper from "../../Util/ImageCropper.jsx";

export const TeamCard = ({ name, players = [], img, uuid, is_available }) => {
  const [editing, setEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(img);
  const [cropping, setCropping] = useState(false);
  const { showNotification } = useNotification();
  const [popupTeamOpen, setPopupTeamOpen] = useState(false);
  const [popupPlayerOpen, setPopupPlayerOpen] = useState(false);
  const [removePlayer, setRemovePlayer] = useState();

  const toggleEditing = () => {
    setEditing((editing) => !editing);
  };

  const onRemovePlayer = (player) => {
    setRemovePlayer(player);
    setPopupPlayerOpen(true);
  };

  const removePlayerFunc = async () => {
    try {
      await removePlayerFromTeam(uuid, removePlayer.uuid);
      location.reload();
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "Error while removing the player."
      );
    }
  };

  const toggleActive = async (player) => {
    try {
      await setPlayerActive(uuid, player.uuid, player.is_active === false);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification("Error while updating the player.");
    }
  };

  const deleteClicked = () => {
    setPopupTeamOpen(true);
  };

  const deleteTeamFunc = async () => {
    try {
      await deleteTeam(uuid);
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification("Error while attempting to delete a team.");
    }
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readImageFile(file);
      setImageSrc(imageDataUrl);
      setCropping(true);
    }
  };

  const setCroppedImage = async (croppedImage) => {
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "team_image.jpg", {
        type: "image/jpeg",
      });

      // Placeholder API call - replace with actual implementation
      await updateTeamImage(uuid, file);
      setImageSrc(croppedImage);
      setCropping(false);
      showNotification("Team image updated successfully.");
    } catch (error) {
      console.error("Error updating team image:", error);
      showNotification("Error updating team image.");
    }
  };

  const handleCloseCropper = () => {
    setCropping(false);
    setImageSrc(img);
  };

  const readImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const inviteUrl = `${import.meta.env.VITE_FRONTEND_URL}/invite/team/${uuid}`;

  return (
    <div className="relative flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <div
        className={`relative ${
          editing
            ? "min-[80px] w-[80px] h-[80px]"
            : "min-w-[60px] w-[60px] h-[60px]"
        } rounded-md`}
      >
        <Img
          src={imageSrc}
          className={`w-full h-full bg-white rounded-md  ${
            editing ? "min-w-[80px] h-[80px]" : "min-w-[60px] h-[60px]"
          } `}
        />
        {editing && (
          <label htmlFor="team-photo-upload" className="cursor-pointer">
            <CameraAltIcon
              sx={{ fontSize: 40 }}
              className="absolute z-20 w-full h-full transform -translate-x-1/2 -translate-y-1/2 opacity-80 text-neutral top-1/2 left-1/2"
            />
            <input
              id="team-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <div className="flex items-start justify-between w-full min-h-[60px]">
        <div>
          <h3 className="font-bold text-[18px]">{name}</h3>
          <div className="text-[16px]">
            {editing ? (
              <div className="flex flex-col gap-1 pr-6">
                {players.map((player) => (
                  <div key={player.uuid} className="flex items-center gap-1">
                    <button onClick={() => onRemovePlayer(player)}>
                      <RemoveIcon
                        className="text-errorRed"
                        sx={{ fontSize: 20 }}
                      />
                    </button>
                    <span
                      className={`text-[14px] ${
                        player.is_active === false ? "text-light" : ""
                      }`}
                    >
                      {player.name}
                    </span>
                    <button
                      className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full border ${
                        player.is_active === false
                          ? "border-gray-300 text-light"
                          : "border-tertiary text-tertiary"
                      }`}
                      onClick={() => toggleActive(player)}
                    >
                      {player.is_active === false ? "Dormant" : "Active"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[14px] font-semibold">
                {players.map((player, i) => (
                  <span
                    key={player.uuid}
                    className={
                      player.is_active === false ? "text-light font-normal" : ""
                    }
                  >
                    {i > 0 && (
                      <span className="text-[12px] font-normal">
                        {" "}
                        &{" "}
                      </span>
                    )}
                    {player.name}
                    {player.is_active === false && (
                      <span className="text-[10px]"> (dormant)</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="absolute flex right-2 top-2" onClick={toggleEditing}>
          {editing ? (
            <CloseIcon sx={{ fontSize: 20 }} />
          ) : (
            <EditIcon sx={{ fontSize: 20 }} />
          )}
        </button>
        {editing && (
          <button
            className="p-1 px-2  rounded-md bg-errorRed text-[12px] mt-3 absolute bottom-2 right-2"
            onClick={deleteClicked}
          >
            Delete Team
          </button>
        )}
        {!editing && is_available !== false && (
          <div className="absolute bottom-2 right-2 text-primary text-[12px] border-primary border p-1 rounded-md flex items-center gap-1">
            <CopyWrapper copyString={inviteUrl} size={20}>
              <span className="mr-1">Copy Invite Link</span>
            </CopyWrapper>
          </div>
        )}
      </div>
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
          removePlayer && removePlayer.name
        } from this team?`}
        desc={`This permanently removes ${
          removePlayer && removePlayer.name
        } from the roster. If the team has already played, removal is blocked —
        mark them dormant instead so their history stays put.`}
        continueText={"Delete"}
        continueFunc={removePlayerFunc}
      />
      {cropping && (
        <ImageCropper
          img={imageSrc}
          setCroppedImage={setCroppedImage}
          handleCloseCropper={handleCloseCropper}
        />
      )}
    </div>
  );
};

const ManageTeams = ({ teams, broUUID }) => {
  const [addingTeam, setAddingTeam] = useState(false);
  const { showNotification } = useNotification();
  const toggleAddingTeam = () => {
    setAddingTeam((addingTeam) => !addingTeam);
  };

  const [teamName, setTeamName] = useState("");
  const handleChangeTeamName = (e) => {
    setTeamName(e.target.value);
  };
  const handleCreateTeamClicked = async () => {
    try {
      await createTeam({ name: teamName, brolympics: broUUID });
      location.reload();
    } catch (error) {
      console.log(error);
      showNotification(
        "Error while attempting to create a team. Please try again later."
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {teams && teams.length > 0 ? (
        teams.map((team, i) => <TeamCard {...team} key={i + "_teamsCard"} />)
      ) : (
        <p className="text-sm text-light">No teams yet.</p>
      )}

      <button
        className={`flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-semibold rounded-full ${
          addingTeam ? "text-light bg-gray-100" : "text-white bg-primary"
        }`}
        onClick={toggleAddingTeam}
      >
        {addingTeam ? (
          <>
            <RemoveIcon sx={{ fontSize: 18 }} /> Close
          </>
        ) : (
          <>
            <AddCircleOutlineIcon sx={{ fontSize: 18 }} /> Add Team
          </>
        )}
      </button>
      {addingTeam && (
        <div className="flex flex-col gap-3 p-3 bg-white border border-gray-200 rounded-lg">
          <div>
            <label htmlFor="manage-team-name" className="form-label">
              Team name
            </label>
            <input
              id="manage-team-name"
              value={teamName}
              onChange={handleChangeTeamName}
              placeholder="The Dream Team"
              className="w-full input-primary"
              autoComplete="off"
            />
          </div>
          <button
            className={`w-full py-2.5 font-semibold rounded-full ${
              teamName.trim()
                ? "text-white bg-primary"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
            onClick={teamName.trim() ? handleCreateTeamClicked : undefined}
            disabled={!teamName.trim()}
          >
            Create Team
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTeams;
