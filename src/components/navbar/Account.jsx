import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAuth } from "../../context/AuthContext";
import ImageCropper, { readImageFile } from "../Util/ImageCropper";
import { updateUserImg, updateUserInfo } from "../../api/auth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Account = ({ setView }) => {
  const { user, logout, auth } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState("");

  useEffect(() => {
    setUserInfo(user);
    setImageSrc(user.img || null);
    setImageError(false);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      const file = new File([blob], "profile_image.jpg", {
        type: "image/jpeg",
      });

      await updateUserImg(file);
      setImageSrc(croppedImage);
      setImageError(false);
      setCropping(false);
    } catch (error) {
      console.error("Error updating user image:", error);
    }
  };

  const handleCloseCropper = () => {
    setCropping(false);
    setImageSrc(user.img || null);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSave = async () => {
    try {
      await updateUserInfo(userInfo);
      setIsEditing(false);
      if (!user.account_complete) {
        location.reload();
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleResetPassword = async () => {

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetPasswordStatus(
        "Password reset email sent. Please check your inbox."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setResetPasswordStatus(
        "Failed to send password reset email. Please try again."
      );
    }
  };

  const handleLogout = () => {
    logout();
    location.reload();
  };

  const goBack = () => {
    setView("leagues");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] opacity-[99%] px-6 py-3 gap-3 bg-gray-100">
      {!user.account_complete && (
        <h2>
          Please complete your account by filling out your first name, last
          name, and your display name.
        </h2>
      )}
      {user.account_complete && (
        <div onClick={goBack} className="cursor-pointer">
          <ArrowBackIcon /> Back
        </div>
      )}
      <div className="flex flex-col items-center justify-center w-full p-4 border card">
        <div className="relative w-32 h-32 mb-4 overflow-hidden border rounded-md">
          {imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt="Profile"
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <CameraAltIcon className="text-neutral" sx={{ fontSize: 60 }} />
            </div>
          )}
          <label
            htmlFor="photo-upload"
            className="absolute inset-0 flex items-center justify-center transition-opacity bg-opacity-50 opacity-0 cursor-pointer hover:opacity-100"
          >
            <CameraAltIcon className="" />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        {isEditing ? (
          <div className="flex flex-col items-center w-full gap-3">
            <input
              className="w-full input-primary"
              name="first_name"
              value={userInfo.first_name || ""}
              placeholder="First Name"
              onChange={handleInputChange}
            />
            <input
              className="w-full input-primary"
              name="last_name"
              value={userInfo.last_name || ""}
              placeholder="Last Name"
              onChange={handleInputChange}
            />
            <input
              className="w-full input-primary"
              name="display_name"
              value={userInfo.display_name || ""}
              placeholder="Display Name"
              onChange={handleInputChange}
            />
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-full mt-2 rounded-md primary-btn"
            >
              <SaveIcon className="mr-2" /> Save Changes
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {userInfo.display_name ||
                `${userInfo.first_name} ${userInfo.last_name}`}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center w-full mt-2 primary-btn"
            >
              <EditIcon className="mr-2" /> Edit Profile
            </button>
          </div>
        )}
      </div>
      {user.provider === "password" && (
        <div className="flex flex-col items-center w-full gap-3 p-4 mt-4 border card">
          <h3 className="text-xl font-bold">Reset Password</h3>
          <p>Click the button below to receive a password reset email.</p>
          {resetPasswordStatus && (
            <p
              className={
                resetPasswordStatus.includes("Failed")
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {resetPasswordStatus}
            </p>
          )}
          <button
            onClick={handleResetPassword}
            className="flex items-center justify-center w-full mt-2 rounded-md primary-btn"
          >
            Send Password Reset Email
          </button>
        </div>
      )}
      <button
        className="flex items-center justify-center w-full p-2 mt-2 font-bold rounded-md red-btn"
        onClick={handleLogout}
      >
        <LogoutIcon className="mr-2" /> Logout
      </button>
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

export default Account;
