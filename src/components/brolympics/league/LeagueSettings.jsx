import React, { useState, useEffect } from "react";
import ImageCropper from "../../Util/ImageCropper";
import { useNotification } from "../../Util/Notification";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  updateLeague,
  updateLeagueImg,
  deleteLeague,
} from "../../../api/league";
import PopupContinue from "../../Util/PopupContinue";
import { useNavigate } from "react-router-dom";

const LeagueSettings = ({ leagueInfo, onSave, onDelete }) => {
  if (!leagueInfo) return <div className="p-4 text-center">Loading...</div>;
  const [name, setName] = useState(leagueInfo.name);
  const [img, setImg] = useState(leagueInfo.img);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    setName(leagueInfo.name);
    setImg(leagueInfo.img);
    setImageError(false);
  }, [leagueInfo]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const setCroppedImage = async (croppedImage) => {
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "league_image.jpg", {
        type: "image/jpeg",
      });

      await updateLeagueImg(leagueInfo.uuid, file);
      setImg(croppedImage);
      setImageError(false);
      setCropping(false);
      showNotification("League image updated successfully", "success");
    } catch (error) {
      console.error("Error updating league image:", error);
      showNotification("Failed to update league image", "error");
    }
  };

  const handleCloseCropper = () => {
    setCropping(false);
    setImageSrc(null);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSave = async () => {
    try {
      await updateLeague(leagueInfo.uuid, name);
      showNotification("League updated successfully", "success");
      if (onSave) onSave({ ...leagueInfo, name });
    } catch (error) {
      console.error("Error updating league:", error);
      showNotification("Failed to update league", "error");
    }
  };

  const handleDelete = async () => {
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLeague(leagueInfo.uuid);
      showNotification("League deleted successfully", "success");
      if (onDelete) onDelete(leagueInfo.uuid);
      navigate("/");
    } catch (error) {
      console.error("Error deleting league:", error);
      showNotification("Failed to delete league", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto container-padding">
      <h1 className="my-6 text-center header">League Settings</h1>
      <div className="p-6 space-y-2 card">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 overflow-hidden rounded-md">
            {img && !imageError ? (
              <img
                src={img}
                alt="League"
                className="object-cover w-full h-full"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <CameraAltIcon
                  className="text-gray-400"
                  sx={{ fontSize: 48 }}
                />
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 cursor-pointer hover:opacity-100"
            >
              <CameraAltIcon className="text-white" sx={{ fontSize: 24 }} />
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="league-name" className="form-label">
            League Name
          </label>
          <input
            id="league-name"
            className="w-full input-primary"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter league name"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center w-full btn primary-btn"
        >
          <SaveIcon className="mr-2" sx={{ fontSize: 18 }} /> Save Changes
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center w-full btn red-btn"
        >
          <DeleteIcon className="mr-2" sx={{ fontSize: 18 }} /> Delete League
        </button>
      </div>

      {imageError &&
        showNotification(
          "There was an error loading the image. Please try again.",
          "error"
        )}

      {cropping && (
        <ImageCropper
          img={imageSrc}
          setCroppedImage={setCroppedImage}
          handleCloseCropper={handleCloseCropper}
        />
      )}

      <PopupContinue
        open={isDeletePopupOpen}
        setOpen={setIsDeletePopupOpen}
        header="Delete League"
        desc="Are you sure you want to delete this league? This action cannot be undone."
        continueText="Delete"
        continueFunc={confirmDelete}
      />
    </div>
  );
};

export default LeagueSettings;
