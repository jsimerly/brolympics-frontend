import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  updateTeam,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification.jsx";
import ImageCropper from "../../Util/ImageCropper.jsx";
import { apiErrorMessage } from "../../Util/apiError";

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
      showNotification(
        apiErrorMessage(error, "Error while removing the player.")
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
      // data-URL through the serializer, same as MyTeamCard: the backend
      // assigns a unique filename (constant multipart names once made every
      // team share one storage object -- the Summer 2023 same-flag incident)
      await updateTeam(uuid, { img: croppedImage });
      setImageSrc(croppedImage);
      setCropping(false);
      showNotification("Team image updated successfully.", "success");
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
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Img
            src={imageSrc}
            alt={name}
            kind="team"
            className="object-cover rounded-lg w-14 h-14"
          />
          {editing && (
            <label
              htmlFor={`team-photo-${uuid}`}
              className="absolute inset-0 flex items-center justify-center rounded-lg cursor-pointer bg-black/40"
            >
              <CameraAltIcon sx={{ fontSize: 20 }} className="text-white" />
              <input
                id={`team-photo-${uuid}`}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </label>
          )}
        </div>

        <div className="flex flex-col flex-grow min-w-0 gap-0.5">
          <h3 className="font-semibold leading-tight">{name}</h3>
          {editing ? (
            <div className="flex flex-col gap-1 pt-1">
              {players.map((player) => (
                <div
                  key={player.uuid}
                  className="flex items-center gap-2 text-sm"
                >
                  <button
                    onClick={() => onRemovePlayer(player)}
                    title="Remove from team"
                    className="shrink-0"
                  >
                    <RemoveCircleOutlineIcon
                      sx={{ fontSize: 18 }}
                      className="text-red"
                    />
                  </button>
                  <span
                    className={`min-w-0 truncate ${
                      player.is_active === false ? "text-light" : ""
                    }`}
                  >
                    {player.name}
                  </span>
                  <button
                    className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
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
              {players.length === 0 && (
                <span className="text-sm text-light">No players yet.</span>
              )}
              <button
                className="self-start pt-1 text-xs font-semibold text-red"
                onClick={deleteClicked}
              >
                Delete this team
              </button>
            </div>
          ) : (
            players.map((player) => (
              <span className="text-sm text-light" key={player.uuid}>
                {player.name}
                {player.is_active === false && (
                  <span className="text-[10px]"> (dormant)</span>
                )}
              </span>
            ))
          )}
        </div>

        <button className="shrink-0 text-light" onClick={toggleEditing}>
          {editing ? (
            <CloseIcon sx={{ fontSize: 20 }} />
          ) : (
            <EditIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>

      {!editing && is_available !== false && (
        <div className="pt-3 mt-3 border-t border-gray-100">
          <CopyWrapper copyString={inviteUrl}>
            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
              <ContentCopyIcon
                sx={{ fontSize: 14 }}
                className="shrink-0 text-light"
              />
              <span className="text-xs truncate text-light">{inviteUrl}</span>
            </div>
          </CopyWrapper>
        </div>
      )}
      <PopupContinue
        open={popupTeamOpen}
        setOpen={setPopupTeamOpen}
        header={"Delete this Team?"}
        desc={"This permanently deletes the team and its roster spots."}
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
