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
      color="primary"
      button_text="Create Brolympics"
      step={step}
      submit={handleCreateClicked}
      title="Create a Brolympics"
      description="A Brolympics is a group of events and competitions that are battled out between teams of 2."
    >
      <div className="flex flex-col w-full gap-6">
        <div>
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={brolympics.name}
            onChange={handleNameChange}
            placeholder="Ex: Summer 2023"
            className="w-full input-primary"
          />
        </div>
        <div>
          <label htmlFor="date" className="form-label">
            Start Date <span className="text-sm text-light">(Optional)</span>
          </label>
          <input
            id="date"
            type="datetime-local"
            value={brolympics.date}
            onChange={handleDateChange}
            className="w-full input-primary"
          />
        </div>
        <div>
          <label htmlFor="file_bro" className="form-label">
            Upload a Logo <span className="text-sm text-light">(Optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            id="file_bro"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="file_bro"
            className="w-32 h-32 transition-all duration-300 border-2 border-dashed cursor-pointer flex-center rounded-border border-primary hover:border-primary-dark"
          >
            {brolympics.img ? (
              <img
                src={brolympics.img}
                className="object-cover w-full h-full rounded-md"
                alt="Brolympics logo"
              />
            ) : (
              <CameraAltIcon className="text-primary" size={48} />
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
