import { useState } from "react";
import CreateWrapper from "./CreateWrapper";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageCropper, { readImageFile } from "../Util/ImageCropper";
import { DateInput } from "../Util/Inputs";
import { useNotification } from "../Util/Notification";

const CreateBrolympics = ({ step, nextStep, setBrolympics }) => {
  const [brolympics, setBrolympicsData] = useState({
    name: "",
    img: null,
    imgSrc: null,
    date: "",
  });
  const [cropping, setCropping] = useState(false);
  const { showNotification } = useNotification();

  const handleCreateClicked = () => {
    if (brolympics.name) {
      nextStep();
      setBrolympics(brolympics);
    } else {
      showNotification("You must enter a name.");
    }
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readImageFile(file);

      setBrolympicsData((prevBro) => ({
        ...prevBro,
        img: file,
        imgSrc: imageDataUrl,
      }));
      setCropping(true);
    }
  };

  const setCroppedImage = (croppedImage) => {
    setBrolympicsData((prevBro) => ({ ...prevBro, img: croppedImage }));
    setCropping(false);
  };

  const handleNameChange = (e) => {
    setBrolympicsData((prevBro) => ({
      ...prevBro,
      name: e.target.value,
    }));
  };

  const handleDateChange = (e) => {
    setBrolympics((prevBrolympics) => ({
      ...prevBrolympics,
      date: e.target.value,
    }));
  };

  return (
    <CreateWrapper
      button_text={"Create Brolympics"}
      step={step}
      submit={handleCreateClicked}
      title={"Create a Brolympics"}
      description={
        "A Brolympics is a group of events and competitions that are battled out between teams of 2."
      }
    >
      <div className="flex flex-col w-full gap-3">
        <div>
          <h3 className="ml-1">Name *</h3>
          <input
            type="text"
            value={brolympics.name}
            onChange={handleNameChange}
            placeholder="Ex: Summer 2023"
            className="w-full p-2 border border-gray-200 rounded-md"
          />
        </div>
        <div>
          <h3 className="ml-1">
            Start Date <span className="text-[12px]"> (Optional)</span>
          </h3>
          <input
            type="datetime-local"
            value={brolympics.date}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-200 rounded-md"
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
            {brolympics.img ? (
              <img src={brolympics.img} className="max-w-[100px] rounded-md" />
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
              img={brolympics.imgSrc}
              setCroppedImage={setCroppedImage}
            />
          )}
        </div>
      </div>
    </CreateWrapper>
  );
};

export default CreateBrolympics;
