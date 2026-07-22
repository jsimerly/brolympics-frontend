import { useState } from "react";
import CreateWrapper from "./CreateWrapper";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import ImageCropper, { readImageFile } from "../Util/ImageCropper";
import usePersistentState from "../../hooks/usePersistentState";

const TYPES = [
  {
    mode: "traditional",
    label: "Traditional",
    hint: "Teams of 2 — the classic",
    Icon: GroupIcon,
  },
  {
    mode: "individual",
    label: "Individual",
    hint: "Every player for themself",
    Icon: PersonIcon,
  },
  {
    mode: "custom",
    label: "Big Teams",
    hint: "Pick your team size",
    Icon: GroupsIcon,
  },
];

/** Human name for a league's structure (team_size). */
const structureLabel = (size) => {
  if (size === 1) return "Individual — every player for themself";
  if (size === 2) return "Traditional — teams of 2";
  return `Teams of ${size}`;
};

const CreateBrolympics = ({
  step,
  totalSteps,
  nextStep,
  setBrolympics,
  storageKey,
  // set when creating inside an existing league: the structure is the
  // league's, not a choice (ruled 2026-07-22 -- new structure = new league)
  lockedTeamSize = null,
}) => {
  const [form, setForm] = usePersistentState(storageKey || "wizard:bro-form", {
    name: "",
    img: null,
    projected_start_date: "",
    projected_end_date: "",
    mode: "traditional",
    custom_size: "4",
  });
  // older stashed forms predate the type picker
  const mode = form.mode || "traditional";
  const [imgSrc, setImgSrc] = useState(null); // pre-crop original, not persisted
  const [cropping, setCropping] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const locked = lockedTeamSize != null;
  const datesInvalid =
    form.projected_start_date &&
    form.projected_end_date &&
    form.projected_end_date < form.projected_start_date;
  const customSize = Number(form.custom_size);
  const customInvalid =
    !locked &&
    mode === "custom" &&
    (!Number.isInteger(customSize) || customSize < 2);
  const valid = form.name.trim().length > 0 && !datesInvalid && !customInvalid;

  const teamSize = locked
    ? lockedTeamSize
    : mode === "individual"
    ? 1
    : mode === "custom"
    ? customSize
    : 2;

  const handleCreateClicked = () => {
    if (!valid) return;
    setBrolympics({
      name: form.name.trim(),
      img: form.img,
      projected_start_date: form.projected_start_date || null,
      projected_end_date: form.projected_end_date || null,
      team_size: teamSize,
    });
    nextStep();
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readImageFile(file);
      setImgSrc(imageDataUrl);
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

        {locked ? (
          <div>
            <span className="form-label">Type</span>
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold">
                {structureLabel(lockedTeamSize)}
              </p>
              <p className="text-[11px] text-light">
                League standard — every Brolympics in this league shares one
                structure. Want a different one? Start a new league.
              </p>
            </div>
          </div>
        ) : (
        <div>
          <span className="form-label">Type</span>
          <div className="grid grid-cols-3 gap-1.5">
            {TYPES.map(({ mode: m, label, hint, Icon }) => (
              <button
                key={m}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, mode: m }))}
                className={`flex flex-col items-center gap-1 px-1.5 py-2.5 text-center transition-colors border rounded-lg ${
                  mode === m
                    ? "border-primary bg-primary/5"
                    : "bg-white border-gray-200"
                }`}
              >
                <Icon
                  sx={{ fontSize: 24 }}
                  className={mode === m ? "text-primary" : "text-light"}
                />
                <span className="text-xs font-medium leading-tight">
                  {label}
                </span>
                <span className="text-[10px] leading-tight text-light">
                  {hint}
                </span>
              </button>
            ))}
          </div>
          {mode === "custom" && (
            <div className="flex items-center justify-between gap-3 p-2.5 mt-1.5 bg-white border border-gray-200 rounded-lg">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold">Players per team</h4>
                <p className="text-[10px] text-light">
                  The standard size — teams stop listing as open once they hit
                  it, but an extra teammate can always be added.
                </p>
              </div>
              <input
                type="number"
                min="2"
                value={form.custom_size ?? ""}
                onChange={set("custom_size")}
                className="w-16 p-2 text-center bg-white border border-gray-300 rounded-md shrink-0"
              />
            </div>
          )}
          {mode === "individual" && (
            <p className="mt-1 text-xs text-light">
              Everyone competes solo — players get their own scoring column the
              moment they join. Great for camps and big groups.
            </p>
          )}
          {customInvalid && (
            <p className="mt-1 text-xs text-red">
              Team size needs to be a whole number of at least 2.
            </p>
          )}
        </div>
        )}

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
            <ImageCropper
              img={imgSrc}
              setCroppedImage={setCroppedImage}
              handleCloseCropper={() => setCropping(false)}
            />
          )}
        </div>
      </div>
    </CreateWrapper>
  );
};

export default CreateBrolympics;
