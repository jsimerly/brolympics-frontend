import { useState } from "react";
import { useParams } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImageCropper, { readImageFile } from "../../Util/ImageCropper";
import CopyWrapper from "../../Util/CopyWrapper";
import PopupContinue from "../../Util/PopupContinue";
import {
  deleteBrolympics,
  updateBrolympics,
  inviteLinkBrolympics,
} from "../../../api/client";
import { useNotification } from "../../Util/Notification";
import { apiErrorMessage } from "../../Util/apiError";

// datetime-local inputs need "YYYY-MM-DDTHH:mm"; the API returns full ISO
const toLocalInput = (iso) => (iso ? iso.slice(0, 16) : "");

const ManageBro = ({ name, projected_start_date, projected_end_date, img }) => {
  const [cropping, setCropping] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const [broData, setBroData] = useState({
    name: name || "",
    img: img,
    projected_start_date: toLocalInput(projected_start_date),
    projected_end_date: toLocalInput(projected_end_date),
  });

  const { showNotification } = useNotification();
  const { uuid } = useParams();

  const set = (key) => (e) =>
    setBroData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(await readImageFile(e.target.files[0]));
      setCropping(true);
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateBrolympics(uuid, {
        ...broData,
        projected_start_date: broData.projected_start_date || null,
        projected_end_date: broData.projected_end_date || null,
      });
      showNotification("Your Brolympics has been updated.", "success");
    } catch (error) {
      console.log(error);
      showNotification("There was an issue saving your changes.");
    } finally {
      setSaving(false);
    }
  };

  const deleteBro = async () => {
    try {
      // played history archives (recoverable by support); empty shells delete
      const resp = await deleteBrolympics(uuid);
      showNotification(
        resp?.data?.archived
          ? "Brolympics archived — its history is safe and support can restore it."
          : "This Brolympics has been deleted.",
        "!border-primary"
      );
      // full load, not SPA navigation: every cached list (hamburger, league
      // page) must forget this bro right now
      window.location.href = "/";
    } catch (error) {
      showNotification(
        apiErrorMessage(error, "There was an error deleting this Brolympics.")
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start gap-3">
          <input
            type="file"
            accept="image/*"
            id="file_bro"
            onChange={handleImageUpload}
            hidden
          />
          <label htmlFor="file_bro" className="relative cursor-pointer shrink-0">
            {broData.img ? (
              <img
                src={broData.img}
                className="object-cover w-16 h-16 rounded-lg"
                alt="Brolympics logo"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg text-light">
                <CameraAltIcon sx={{ fontSize: 24 }} />
              </div>
            )}
            <span className="absolute p-0.5 bg-white border border-gray-200 rounded-full -bottom-1 -right-1">
              <CameraAltIcon sx={{ fontSize: 14 }} className="text-light" />
            </span>
          </label>
          <div className="flex-grow min-w-0">
            <label htmlFor="bro-name" className="form-label">
              Name
            </label>
            <input
              id="bro-name"
              value={broData.name}
              onChange={set("name")}
              className="w-full input-primary"
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <span className="form-label">Dates</span>
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label htmlFor="bro-start" className="text-xs text-light">
                Starts
              </label>
              <input
                id="bro-start"
                type="datetime-local"
                value={broData.projected_start_date}
                onChange={set("projected_start_date")}
                className="w-full min-w-0 input-primary"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="bro-end" className="text-xs text-light">
                Ends
              </label>
              <input
                id="bro-end"
                type="datetime-local"
                value={broData.projected_end_date}
                onChange={set("projected_end_date")}
                className="w-full min-w-0 input-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <span className="form-label">
            Invite link{" "}
            <span className="font-normal text-light">
              — the only door in
            </span>
          </span>
          <CopyWrapper copyString={inviteLinkBrolympics(uuid)}>
            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
              <ContentCopyIcon
                sx={{ fontSize: 14 }}
                className="shrink-0 text-light"
              />
              <span className="text-xs truncate text-light">
                {inviteLinkBrolympics(uuid)}
              </span>
            </div>
          </CopyWrapper>
        </div>

        <button
          className="w-full py-2.5 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 p-3 border rounded-lg border-red/30">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-red">Delete Brolympics</h4>
          <p className="text-[10px] leading-snug text-light">
            Teams, events, and results go with it. Played history is archived
            and recoverable by support.
          </p>
        </div>
        <button
          className="px-4 py-1.5 text-sm font-semibold border rounded-full shrink-0 text-red border-red"
          onClick={() => setPopupDelete(true)}
        >
          Delete
        </button>
      </div>

      {cropping && (
        <ImageCropper
          img={imgSrc}
          setCroppedImage={(cropped) => {
            setBroData((prev) => ({ ...prev, img: cropped }));
            setCropping(false);
          }}
          handleCloseCropper={() => setCropping(false)}
        />
      )}
      <PopupContinue
        open={popupDelete}
        setOpen={setPopupDelete}
        header="Delete this Brolympics?"
        desc="This permanently deletes the Brolympics with all of its teams, events, and results. It cannot be recovered."
        continueText="Delete"
        continueFunc={deleteBro}
      />
    </div>
  );
};

export default ManageBro;
