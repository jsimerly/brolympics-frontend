import { SettingRow, rowInputClass } from "./ManageEvent";

const SectionLabel = ({ children }) => (
  <span className="block pt-3 pb-1 text-xs font-semibold tracking-wide uppercase text-light">
    {children}
  </span>
);

const ScoringSettings = ({ formValues, setFormValues, handleInputChange }) => (
  <>
    <SectionLabel>Scoring</SectionLabel>
    <SettingRow
      label="Score precision"
      hint="Whole numbers, decimals, or just win/loss."
    >
      <select
        name="decimal_places"
        value={formValues.decimal_places || ""}
        onChange={handleInputChange}
        className="p-2 bg-white border border-gray-300 rounded-md shrink-0"
      >
        <option value="B">Win/Loss</option>
        <option value="0">Whole</option>
        <option value="1">0.0</option>
        <option value="2">0.00</option>
        <option value="3">0.000</option>
        <option value="16">Max</option>
      </select>
    </SettingRow>
    <SettingRow label="Winner" hint="Who takes it — the high or the low score.">
      <div className="flex overflow-hidden text-xs font-semibold border border-gray-300 rounded-full shrink-0">
        {[
          [true, "High"],
          [false, "Low"],
        ].map(([value, label]) => (
          <button
            key={label}
            className={`px-3 py-1.5 ${
              !!formValues.is_high_score_wins === value
                ? "bg-primary text-white"
                : "bg-white text-light"
            }`}
            onClick={() =>
              setFormValues((prev) => ({ ...prev, is_high_score_wins: value }))
            }
          >
            {label}
          </button>
        ))}
      </div>
    </SettingRow>
    <SettingRow label="Score limits" hint="Optional min and max per score.">
      <div className="flex items-center gap-1.5 shrink-0">
        <input
          name="min_score"
          value={formValues.min_score || ""}
          onChange={handleInputChange}
          className={rowInputClass}
          type="number"
          placeholder="min"
        />
        <span className="text-light">–</span>
        <input
          name="max_score"
          value={formValues.max_score || ""}
          onChange={handleInputChange}
          className={rowInputClass}
          type="number"
          placeholder="max"
        />
      </div>
    </SettingRow>

    <SectionLabel>Name & Schedule</SectionLabel>
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-light">Event name</label>
        <input
          value={formValues.name || ""}
          onChange={handleInputChange}
          name="name"
          className="w-full input-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <label className="text-xs text-light">Starts</label>
          <input
            value={formValues.projected_start_date || ""}
            onChange={handleInputChange}
            name="projected_start_date"
            className="w-full min-w-0 input-primary"
            type="datetime-local"
          />
        </div>
        <div className="min-w-0">
          <label className="text-xs text-light">Ends</label>
          <input
            value={formValues.projected_end_date || ""}
            onChange={handleInputChange}
            name="projected_end_date"
            className="w-full min-w-0 input-primary"
            type="datetime-local"
          />
        </div>
      </div>
      <p className="text-[10px] text-light -mt-1">
        Leave dates blank for play-anytime events — they show as TBD in the
        lineup.
      </p>
    </div>
  </>
);

export default ScoringSettings;
