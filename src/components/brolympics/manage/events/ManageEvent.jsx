import ManageEventWrapper from "./ManageEventWrapper";
import { useState, useEffect } from "react";
import ScoringSettings from "./ScoringSettings";
import { updateEvent, deleteEvent } from "../../../../api/client";
import PopupContinue from "../../../Util/PopupContinue";
import { useNotification } from "../../../Util/Notification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// datetime-local inputs need "YYYY-MM-DDTHH:mm"; the API returns full ISO
const toLocalInput = (iso) => (iso ? iso.slice(0, 16) : "");

/** A labeled settings row: text on the left, a compact control on the right. */
export const SettingRow = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="min-w-0">
      <h4 className="text-sm font-semibold">{label}</h4>
      {hint && <p className="text-[10px] text-light">{hint}</p>}
    </div>
    {children}
  </div>
);

export const rowInputClass =
  "w-16 p-2 text-center bg-white border border-gray-300 rounded-md shrink-0";

const SectionLabel = ({ children }) => (
  <span className="block pt-3 pb-1 text-xs font-semibold tracking-wide uppercase text-light first:pt-0">
    {children}
  </span>
);

/** Settings editor for any event. h2h events expose their stage config
 * (matches per team, bracket size) while unstarted; ind/team events expose
 * the score-display toggle. Everything else is shared. */
const ManageEvent = ({ event }) => {
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
        projected_start_date: toLocalInput(event.projected_start_date),
        projected_end_date: toLocalInput(event.projected_end_date),
        n_matches: rr?.config?.games_per_team ?? "",
        bracket_take: ko?.config?.take ?? "",
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
    if (saving) return;
    setSaving(true);
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
          : "There was an issue updating this event."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEventFunc = async () => {
    try {
      await deleteEvent(event.uuid);
      showNotification(`Deleted ${event.name}.`, "!border-primary");
      location.reload();
    } catch (error) {
      showNotification("There was an error deleting this event.");
    }
  };

  const modules = {
    toolbar: [
      [{ size: ["8px", "10px", "12px", "14px", "16px", "20px", "24px", "32px"] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
    ],
  };
  const formats = [
    "header", "font", "size", "bold", "italic", "underline",
    "list", "bullet", "indent", "link",
  ];

  return (
    <ManageEventWrapper name={event.name} event={event}>
      <div className="flex flex-col">
        {isH2h ? (
          <>
            <SectionLabel>Structure</SectionLabel>
            {structureLocked && (
              <p className="text-[10px] text-red">
                This event has started; its structure can no longer change.
              </p>
            )}
            <SettingRow
              label="Matches per team"
              hint="Group-play games before the bracket."
            >
              <input
                value={formValues.n_matches || ""}
                name="n_matches"
                onChange={handleInputChange}
                disabled={structureLocked}
                className={`${rowInputClass} disabled:bg-gray-50 disabled:text-light`}
                type="number"
              />
            </SettingRow>
            <SettingRow
              label="Bracket size"
              hint="How many teams make the playoffs."
            >
              <input
                value={formValues.bracket_take || ""}
                name="bracket_take"
                onChange={handleInputChange}
                disabled={structureLocked}
                className={`${rowInputClass} disabled:bg-gray-50 disabled:text-light`}
                type="number"
              />
            </SettingRow>
          </>
        ) : (
          <>
            <SectionLabel>Display</SectionLabel>
            <SettingRow
              label="Score display"
              hint="Show each team's average or combined total."
            >
              <div className="flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0">
                {[
                  [false, "Total"],
                  [true, "Average"],
                ].map(([value, label]) => (
                  <button
                    key={label}
                    className={`px-3 py-1.5 ${
                      !!formValues.display_avg_scores === value
                        ? "bg-primary text-white"
                        : "bg-white text-light"
                    }`}
                    onClick={() =>
                      setFormValues((prev) => ({
                        ...prev,
                        display_avg_scores: value,
                      }))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </>
        )}

        <SectionLabel>Details</SectionLabel>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-light">Location</label>
            <input
              value={formValues.location || ""}
              name="location"
              onChange={handleInputChange}
              className="w-full input-primary"
              type="text"
              placeholder="The backyard, lane 4, ..."
            />
          </div>
          <div>
            <label className="text-xs text-light">Rules</label>
            <ReactQuill
              theme="snow"
              value={formValues.rules || ""}
              onChange={(content) =>
                setFormValues((prev) => ({ ...prev, rules: content }))
              }
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
          className="w-full py-2.5 mt-4 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
          onClick={handleUpdateClicked}
          disabled={saving}
        >
          {saving ? "Saving..." : `Save ${event.name}`}
        </button>
        <button
          className="self-center pt-3 text-xs font-semibold text-red"
          onClick={() => setDeleteOpen(true)}
        >
          Delete this event
        </button>
      </div>

      <PopupContinue
        open={deleteOpen}
        setOpen={setDeleteOpen}
        header={`Delete ${event.name}?`}
        desc="This removes the event from your Brolympics. You can recreate it later, but these settings are gone."
        continueText="Delete"
        continueFunc={deleteEventFunc}
      />
    </ManageEventWrapper>
  );
};

export default ManageEvent;
