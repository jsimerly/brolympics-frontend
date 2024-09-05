import { useState } from "react";
import ImageCropper, { readImageFile } from "../../Util/ImageCropper";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CopyWrapper from "../../Util/CopyWrapper";
import {
  fetchDeleteBrolympics,
  fetchUpdateBrolympics,
} from "../../../api/brolympics";
import PopupContinue from "../../Util/PopupContinue";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../Util/Notification";

const ManageBro = ({ name, startDate, endDate, img }) => {
  const [cropping, setCropping] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [broData, setBroData] = useState({
    name: name,
    img: img,
    projected_start_date: startDate,
    projected_end_date: endDate,
  });

  const handleStartDateUpdate = (e) => {
    const newStartDate = e.target.value;
    setBroData({
      ...broData,
      projected_start_date: newStartDate,
    });
  };

  const handleEndDateUpdate = (e) => {
    const newEndDate = e.target.value;
    setBroData({
      ...broData,
      projected_end_date: newEndDate,
    });
  };

  const handleNameUpdates = (e) => {
    setBroData({ ...broData, name: e.target.value });
  };

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { uuid } = useParams();

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readImageFile(file);

      setImgSrc(imageDataUrl);
      setCropping(true);
    }
  };

  const setCroppedImage = (croppedImage) => {
    setBroData((prevData) => ({ ...prevData, img: croppedImage }));
    setCropping(false);
  };

  const [popupDelete, setPopupDelete] = useState(false);

  const onDeleteClicked = () => {
    setPopupDelete(true);
  };

  const deleteTeamFunc = async () => {
    try {
      const data = await fetchDeleteBrolympics(uuid);
      showNotification("This brolympics has been deleted.", "!border-primary");
      navigate("/");
    } catch (error) {
      showNotification(
        "There was an error when attempting to delete this brolympics"
      );
    }
  };

  const handleUpdateClicked = async () => {
    const data = broData;
    data['uuid'] = uuid
    try {
      await fetchUpdateBrolympics(data);
      showNotification("You have updated your Brolympics.", "!border-primary");
    } catch (error) {
      console.log(error);
      showNotification(
        "There was an issue when trying to update your Brolympics."
      );
    }
  };

  return (
    <div className="flex flex-col">
      <PopupContinue
        open={popupDelete}
        setOpen={setPopupDelete}
        header={"Delete this Brolympics?"}
        desc={
          "Deleting this will perminately delete this Brolympics and remove all players and data from it. This will not be able to be recovered. Would you like to continue?"
        }
        continueText={"Delete"}
        continueFunc={deleteTeamFunc}
      />
      <h2 className="font-bold text-[16px]">Manage Brolympics</h2>
      <div>
        <div className="w-full py-3">
          <span className="ml-1 text-[12px]">Name</span>
          <input
            value={broData.name || ""}
            onChange={handleNameUpdates}
            className="w-full p-2 border rounded-md border-primary"
          />
        </div>
        <div>
          <h3 className="ml-1">
            Upload a Logo <span className="text-[12px]"> (Optional)</span>
          </h3>
          <input
            type="file"
            accept="image/*"
            id="file_bro"
            onChange={handleImageUpload}
            hidden
          />
          <label
            htmlFor="file_bro"
            className="inline-flex bg-white border rounded-md cursor-pointer"
          >
            {broData.img ? (
              <img
                src={broData.img}
                className="w-[100px] h-[100px] rounded-md"
              />
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
            <ImageCropper img={imgSrc} setCroppedImage={setCroppedImage} />
          )}
        </div>
        <div className="flex flex-col w-full gap-3 mt-3">
          <div className="flex flex-col">
            <span className="ml-1 text-[12px]">Start Date</span>
            <input
              className="flex w-full p-2 border rounded-md border-primary"
              type="datetime-local"
              value={broData.projected_start_date || ""}
              onChange={handleStartDateUpdate}
            />
          </div>
          <div className="flex flex-col">
            <span className="ml-1 text-[12px]">End Date</span>
            <input
              className="flex w-full p-2 border rounded-md border-primary"
              type="datetime-local"
              value={broData.projected_end_date || ""}
              onChange={handleEndDateUpdate}
            />
          </div>
        </div>
        <div className="mt-3">
          <h4 className="pb-1 font-bold">
            Copy the Link and Share with Friends
          </h4>

          <div className="flex p-2 bg-white border rounded-md">
            <CopyWrapper
              copyString={`https://brolympic.com/invite/brolympics/${uuid}`}
            >
              <span className="text-[12px]">
                https://brolympic.com/invite/brolympics/{uuid}
              </span>
            </CopyWrapper>
          </div>
        </div>
      </div>
      <button
        className="w-full p-2 mt-6 font-semibold text-white rounded-md bg-primary"
        onClick={handleUpdateClicked}
      >
        Update Brolympics
      </button>
      <div>
        <h4 className="pt-6 text-[16px] font-semibold">Danger Zone</h4>
        <button
          className="w-full p-2 mt-6 font-semibold text-white rounded-md bg-errorRed"
          onClick={onDeleteClicked}
        >
          Delete Brolympics
        </button>
      </div>
    </div>
  );
};

export default ManageBro;
