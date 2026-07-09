import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import ImageCropper, { readImageFile } from "../Util/ImageCropper";
import Img from "../Util/Img";
import { updateUserImg, updateUserInfo } from "../../api/auth";
import { sendPasswordResetEmail } from "firebase/auth";

/** The account page inside the drawer: profile card, security, sign out. */
const Account = ({ setView }) => {
  const { user, logout, auth } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [resetPasswordStatus, setResetPasswordStatus] = useState("");

  useEffect(() => {
    setUserInfo(user);
    setImageSrc(user.img || null);
    if (!user.account_complete) {
      setIsEditing(true);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageSrc(await readImageFile(e.target.files[0]));
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
      setCropping(false);
    } catch (error) {
      console.error("Error updating user image:", error);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateUserInfo(userInfo);
      setIsEditing(false);
      if (!user.account_complete) {
        location.reload();
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetPasswordStatus("Reset email sent — check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setResetPasswordStatus("Couldn't send the reset email. Try again.");
    }
  };

  const handleLogout = () => {
    logout();
    location.reload();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {user.account_complete ? (
        <button
          className="flex items-center self-start gap-1 text-sm text-light"
          onClick={() => setView("leagues")}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back
        </button>
      ) : (
        <div className="p-3 text-sm border rounded-lg border-secondary/50 bg-secondary/5">
          <span className="font-semibold">Almost in.</span> Add your name so
          your crew knows who's posting scores.
        </div>
      )}

      <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <input
          type="file"
          accept="image/*"
          id="photo-upload"
          onChange={handlePhotoChange}
          hidden
        />
        <label htmlFor="photo-upload" className="relative cursor-pointer">
          <Img
            src={imageSrc}
            alt="Profile"
            kind="player"
            className="object-cover w-24 h-24 rounded-full"
          />
          <span className="absolute bottom-0 right-0 p-1 bg-white border border-gray-200 rounded-full">
            <CameraAltIcon sx={{ fontSize: 16 }} className="text-light" />
          </span>
        </label>

        {isEditing ? (
          <div className="flex flex-col w-full gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <label className="text-xs text-light">First name</label>
                <input
                  className="w-full min-w-0 input-primary"
                  name="first_name"
                  value={userInfo.first_name || ""}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                />
              </div>
              <div className="min-w-0">
                <label className="text-xs text-light">Last name</label>
                <input
                  className="w-full min-w-0 input-primary"
                  name="last_name"
                  value={userInfo.last_name || ""}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-light">Display name</label>
              <input
                className="w-full input-primary"
                name="display_name"
                value={userInfo.display_name || ""}
                onChange={handleInputChange}
                placeholder="What the leaderboard calls you"
                autoComplete="off"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold leading-tight">
              {userInfo.display_name ||
                `${userInfo.first_name || ""} ${userInfo.last_name || ""}`}
            </h2>
            <span className="text-xs text-light">{user.email}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="pt-2 text-sm font-semibold text-primary"
            >
              Edit profile
            </button>
          </div>
        )}
      </div>

      {user.provider === "password" && (
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">Password</h4>
              <p className="text-[11px] text-light">
                We'll email you a reset link.
              </p>
            </div>
            <button
              className="text-sm font-semibold shrink-0 text-primary"
              onClick={handleResetPassword}
            >
              Send reset email
            </button>
          </div>
          {resetPasswordStatus && (
            <p
              className={`pt-1 text-xs ${
                resetPasswordStatus.includes("Couldn't")
                  ? "text-red"
                  : "text-tertiary"
              }`}
            >
              {resetPasswordStatus}
            </p>
          )}
        </div>
      )}

      <button
        className="flex items-center justify-center w-full gap-2 py-2.5 font-semibold border rounded-full text-red border-red"
        onClick={handleLogout}
      >
        <LogoutIcon sx={{ fontSize: 18 }} /> Sign out
      </button>

      {cropping && (
        <ImageCropper
          img={imageSrc}
          setCroppedImage={setCroppedImage}
          handleCloseCropper={() => {
            setCropping(false);
            setImageSrc(user.img || null);
          }}
        />
      )}
    </div>
  );
};

export default Account;
