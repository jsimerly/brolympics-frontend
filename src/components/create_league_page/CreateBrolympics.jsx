import { useState } from "react";
import CreateWrapper from "./CreateWrapper";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageCropper, { readImageFile } from "../Util/ImageCropper";

const CreateBrolympics = ({ step, totalSteps, nextStep, setBrolympics }) => {
  const [form, setForm] = useState({
    name: "",
    img: null,
    imgSrc: null,
    projected_start_date: "",
    projected_end_date: "",
  });
  const [cropping, setCropping] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const datesInvalid =
    form.projected_start_date &&
    form.projected_end_date &&
    form.projected_end_date < form.projected_start_date;
  const valid = form.name.trim().length > 0 && !datesInvalid;

  const handleCreateClicked = () => {
    if (!valid) return;
    setBrolympics({
      name: form.name.trim(),
      img: form.img,
      projected_start_date: form.projected_start_date || null,
      projected_end_date: form.projected_end_date || null,
    });
    nextStep();
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readImageFile(file);
      setForm((prev) => ({ ...prev, img: file, imgSrc: imageDataUrl }));
      setCropping(true);
    }
  };

  const setCroppedImage = (croppedImage) => {
    setForm((prev) => ({ ...prev, img: croppedImage }));
    setCropping(false);
  };

  return (
    <CreateWrapper
      button_text="Next: Add Events"
      step={step}
      totalSteps={totalSteps}
      submit={handleCreateClicked}
      disabled={!valid}
      title="Create a Brolympics"
      description="Name the games. Events and invites come next."
    >
      <div className="flex flex-col w-full gap-6 py-2">
        <div>
          <label htmlFor="name" className="form-label">
            Name <span className="text-red">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Summer 2026"
            autoComplete="off"
            className="w-full input-primary"
          />
          <p className="mt-1 text-xs text-light">
            Most leagues name it after the season — it becomes this year's
            banner everywhere.
          </p>
        </div>

        <div>
          <span className="form-label">
            Dates <span className="text-sm text-light">(optional)</span>
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label htmlFor="start" className="text-xs text-light">
                Starts
              </label>
              <input
                id="start"
                type="date"
                value={form.projected_start_date}
                onChange={set("projected_start_date")}
                className="w-full min-w-0 input-primary"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="end" className="text-xs text-light">
                Ends
              </label>
              <input
                id="end"
                type="date"
                value={form.projected_end_date}
                onChange={set("projected_end_date")}
                className="w-full min-w-0 input-primary"
              />
            </div>
          </div>
          {datesInvalid && (
            <p className="mt-1 text-xs text-red">
              The end date is before the start date.
            </p>
          )}
        </div>

        <div>
          <span className="form-label">
            Logo <span className="text-sm text-light">(optional)</span>
          </span>
          <input
            type="file"
            accept="image/*"
            id="file_bro"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="file_bro"
            className="flex flex-col items-center justify-center w-32 h-32 gap-1 transition-colors border-2 border-dashed border-gray-300 cursor-pointer rounded-xl hover:border-primary text-light"
          >
            {form.img ? (
              <img
                src={form.img}
                className="object-cover w-full h-full rounded-xl"
                alt="Brolympics logo"
              />
            ) : (
              <>
                <CameraAltIcon />
                <span className="text-xs">Add a logo</span>
              </>
            )}
          </label>
          {cropping && (
            <ImageCropper img={form.imgSrc} setCroppedImage={setCroppedImage} />
          )}
        </div>
      </div>
    </CreateWrapper>
  );
};

export default CreateBrolympics;
