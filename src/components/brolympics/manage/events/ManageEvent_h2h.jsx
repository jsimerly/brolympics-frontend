import ManageEventWrapper from "./ManageEventWrapper";
import { useState, useEffect } from "react";
import ScoringSettings from "./ScoringSettings";
import { fetchUpdateEvent } from "../../../../api/events.js";
import PopupContinue from "../../../Util/PopupContinue";
import { fetchDeleteH2h } from "../../../../api/events.js";
import { useNotification } from "../../../Util/Notification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ManageEvent_h2h = ({ event }) => {
  const [formValues, setFormValues] = useState({});
  const { showNotification } = useNotification();

  useEffect(() => {
    if (event) {
      setFormValues({ ...event });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleUpdateClicked = async () => {
    try {
      const data = await fetchUpdateEvent(formValues);
      showNotification(`${event.name} has been updated.`, "!border-primary");
    } catch (error) {
      showNotification(
        "There was an issue when attemping to update this event."
      );
    }
  };

  const handleRulesChange = (content) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      rules: content,
    }));
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClicked = () => {
    setDeleteOpen(true);
  };

  const deleteEventFunc = async () => {
    try {
      const data = await fetchDeleteH2h(event.uuid);
      showNotification(`Successfully deleted ${event.name}`, "!border-primary");
      location.reload();
    } catch (error) {
      showNotification(
        "There was an error when attemping to delete this event."
      );
    }
  };

  const modules = {
    toolbar: [
      [
        {
          size: ["8px", "10px", "12px", "14px", "16px", "20px", "24px", "32px"],
        },
      ],
      ["bold", "italic", "underline"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  };

  // Quill editor formats
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <ManageEventWrapper name={event.name}>
      <PopupContinue
        open={deleteOpen}
        setOpen={setDeleteOpen}
        header={`Do you want to delete ${event.name}?`}
        desc={
          "Delete this event will remove it from your brolympics. You will be able to recreate the event, but will lose all of your current settings."
        }
        continueText={"Delete"}
        continueFunc={deleteEventFunc}
      />
      <div className="flex flex-col">
        <h2 className="py-2">Match Settings</h2>
        <div className="flex items-center justify-between min-h-[50px]">
          <div>
            <h3 className="font-semibold">Number of Matches</h3>
            <p className="text-[10px]">
              The number of matches each team will compete in during group play.
            </p>
          </div>
          <input
            value={formValues.n_matches || ""}
            name="n_matches"
            onChange={handleInputChange}
            className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
            type="number"
          />
        </div>
        <div className="flex items-center justify-between min-h-[50px]">
          <div>
            <h3 className="font-semibold">Max Concurrent Matches</h3>
            <p className="text-[10px]">
              The number of max possible simulatnious matches. <br /> Ex: 2 sets
              of cornhole boards. Leave blank for no max.
            </p>
          </div>
          <input
            value={formValues.n_active_limit || ""}
            name="n_active_limit"
            onChange={handleInputChange}
            className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
            type="number"
          />
        </div>
        <div className="flex items-center justify-between min-h-[50px]">
          <div>
            {/* Fake form input for now until I can create more options for brackets */}
            <h3 className="font-semibold">Bracket Size</h3>
            <p className="text-[10px]">
              The number of teams to make the playoffs.
            </p>
          </div>
          <div className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center justify-center flex items-center">
            {" "}
            4{" "}
          </div>
        </div>

        <div className="flex flex-col mt-4 space-y-4">
          <div>
            <h3 className="font-semibold">Location</h3>
            <input
              value={formValues.location || ""}
              name="location"
              onChange={handleInputChange}
              className="w-full p-2 bg-white border rounded-md border-primary"
              type="text"
              placeholder="Enter event location"
            />
          </div>
          <div>
            <h3 className="font-semibold">Rules</h3>
            <ReactQuill
              theme="snow"
              value={formValues.rules || ""}
              onChange={handleRulesChange}
              modules={modules}
              formats={formats}
              className="bg-white"
            />
          </div>
        </div>
        <ScoringSettings
          formValues={formValues}
          setFormValues={setFormValues}
          handleInputChange={handleInputChange}
        />
        <button
          className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-primary"
          onClick={handleUpdateClicked}
        >
          Update {event.name}
        </button>
        <button
          className="w-full p-2 mt-3 font-semibold text-white rounded-md bg-errorRed"
          onClick={handleDeleteClicked}
        >
          Delete
        </button>
      </div>
    </ManageEventWrapper>
  );
};

export default ManageEvent_h2h;
