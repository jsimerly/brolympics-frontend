import ManageEventWrapper from "./ManageEventWrapper";
import { useState, useEffect } from "react";
import ScoringSettings from "./ScoringSettings";
import { updateEvent, deleteEvent } from "../../../../api/client";
import ToggleButton from "../../../Util/ToggleButton";
import PopupContinue from "../../../Util/PopupContinue";
import { useNotification } from "../../../Util/Notification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/** Settings editor for any event. h2h events expose their stage config
 * (matches per team, bracket size) while unstarted; ind/team events expose
 * the score-display toggle. Everything else is shared. */
const ManageEvent = ({ event }) => {
  const [formValues, setFormValues] = useState({});
  const { showNotification } = useNotification();
  const isH2h = (event.format || event.type) === "h2h";
  const structureLocked = event.is_active || event.is_complete;

  useEffect(() => {
    if (event) {
      const rr = (event.stages || []).find(
        (s) => s.structure === "round_robin"
      );
      const ko = (event.stages || []).find((s) => s.structure === "knockout");
      setFormValues({
        ...event,
        ...(event.config || {}),
        n_matches: rr?.config?.games_per_team ?? "",
        bracket_take: ko?.config?.take ?? "",
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleRulesChange = (content) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      rules: content,
    }));
  };

  const displayAvgToggle = () => {
    setFormValues({
      ...formValues,
      display_avg_scores: !formValues.display_avg_scores,
    });
  };

  const buildStages = () =>
    (event.stages || []).map((s) => ({
      structure: s.structure,
      config: {
        ...s.config,
        ...(s.structure === "round_robin" && formValues.n_matches
          ? { games_per_team: Number(formValues.n_matches) }
          : {}),
        ...(s.structure === "knockout" && formValues.bracket_take
          ? { take: Number(formValues.bracket_take) }
          : {}),
      },
    }));

  const handleUpdateClicked = async () => {
    try {
      const patch = {
        location: formValues.location || "",
        rules: formValues.rules || "",
        is_high_score_wins: !!formValues.is_high_score_wins,
        projected_start_date: formValues.projected_start_date || null,
        projected_end_date: formValues.projected_end_date || null,
        config: {
          ...(event.config || {}),
          min_score: formValues.min_score ?? null,
          max_score: formValues.max_score ?? null,
          decimal_places: formValues.decimal_places ?? null,
          ...(isH2h
            ? {}
            : { display_avg_scores: !!formValues.display_avg_scores }),
        },
        ...(formValues.name && formValues.name !== event.name
          ? { name_override: formValues.name }
          : {}),
        ...(isH2h && !structureLocked ? { stages: buildStages() } : {}),
      };
      await updateEvent(event.uuid, patch);
      showNotification(`${event.name} has been updated.`, "!border-primary");
    } catch (error) {
      const detail = error.response?.data;
      showNotification(
        detail
          ? String(detail[0] ?? detail.detail ?? JSON.stringify(detail))
          : "There was an issue when attemping to update this event."
      );
    }
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClicked = () => {
    setDeleteOpen(true);
  };

  const deleteEventFunc = async () => {
    try {
      await deleteEvent(event.uuid);
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
        {isH2h ? (
          <>
            <h2 className="py-2">Match Settings</h2>
            {structureLocked && (
              <p className="text-[10px] text-errorRed">
                This event has started; its structure can no longer change.
              </p>
            )}
            <div className="flex items-center justify-between min-h-[50px]">
              <div>
                <h3 className="font-semibold">Number of Matches</h3>
                <p className="text-[10px]">
                  The number of matches each team will compete in during group
                  play.
                </p>
              </div>
              <input
                value={formValues.n_matches || ""}
                name="n_matches"
                onChange={handleInputChange}
                disabled={structureLocked}
                className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
                type="number"
              />
            </div>
            <div className="flex items-center justify-between min-h-[50px]">
              <div>
                <h3 className="font-semibold">Bracket Size</h3>
                <p className="text-[10px]">
                  The number of teams to make the playoffs.
                </p>
              </div>
              <input
                value={formValues.bracket_take || ""}
                name="bracket_take"
                onChange={handleInputChange}
                disabled={structureLocked}
                className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
                type="number"
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="py-2">Competition Settings</h2>
            <div className="flex items-center justify-between min-h-[50px]">
              <div>
                <h3 className="font-semibold">Display Average Scores</h3>
                <p className="text-[10px]">
                  {" "}
                  Do you want to display average scores or combined scores?{" "}
                  <br /> Currently set to:{" "}
                  <span className="font-bold">
                    {formValues.display_avg_scores
                      ? "Average Score"
                      : "Combined Score"}
                  </span>
                </p>
              </div>
              <button
                onClick={displayAvgToggle}
                className="text-primary w-[60px]"
              >
                <ToggleButton size={50} on={formValues.display_avg_scores} />
              </button>
            </div>
          </>
        )}

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
          className="w-full p-2 mt-3 font-semibold  rounded-md bg-primary"
          onClick={handleUpdateClicked}
        >
          Update {event.name}
        </button>
        <button
          className="w-full p-2 mt-3 font-semibold  rounded-md bg-errorRed"
          onClick={handleDeleteClicked}
        >
          Delete
        </button>
      </div>
    </ManageEventWrapper>
  );
};

export default ManageEvent;
