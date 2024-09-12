import ToggleButton from "../../../Util/ToggleButton";

const ScoringSettings = ({ formValues, setFormValues, handleInputChange }) => {
  const highScoreToggle = () => {
    setFormValues({
      ...formValues,
      is_high_score_wins: !formValues.is_high_score_wins,
    });
  };

  return (
    <>
      <h2 className="py-2">Scoring Settings</h2>
      <div className="flex items-center justify-between min-h-[50px]">
        <div>
          <h3 className="font-semibold">Scoring Type (Decimal Places)</h3>
          <p className="text-[10px]">
            {" "}
            Is this event scored by whole numbers, decimal places, or just
            win/loss? Max decimal places: 16
          </p>
        </div>
        <select
          name="decimal_places"
          value={formValues.decimal_places || ""}
          onChange={handleInputChange}
          className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
        >
          <option value="B">Win/Loss</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="16">Max</option>
        </select>
      </div>
      <div className="flex items-center justify-between min-h-[50px]">
        <div>
          <h3 className="font-semibold">High Score to Win</h3>
          <p className="text-[10px]">
            Is this event won by the higher score or the lower score. <br />{" "}
            Currently set to:{" "}
            <span className="font-bold">
              {formValues.is_high_score_wins
                ? "High Score Wins"
                : "Low Score Wins"}
            </span>
          </p>
        </div>
        <button onClick={highScoreToggle} className="text-primary w-[60px]">
          <ToggleButton size={50} on={formValues.is_high_score_wins} />
        </button>
      </div>
      <div className="flex items-center justify-between min-h-[50px]">
        <div>
          <h3 className="font-semibold">Max Score</h3>
          <p className="text-[10px]">
            Highest possible score. Leave blank for no max.
          </p>
        </div>
        <input
          name="max_score"
          value={formValues.max_score || ""}
          onChange={handleInputChange}
          className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
          type="number"
        />
      </div>
      <div className="flex items-center justify-between min-h-[50px]">
        <div>
          <h3 className="font-semibold">Min Score</h3>
          <p className="text-[10px]">
            Lowest possible score. Leave blank for no min.
          </p>
        </div>
        <input
          name="min_score"
          value={formValues.min_score || ""}
          onChange={handleInputChange}
          className="p-1 border rounded-md border-primary h-[40px] w-[60px] bg-white text-center"
          type="number"
        />
      </div>
      <h2 className="py-2">Misc.</h2>
      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-col">
          <span className="ml-1 text-[12px] font-semibold">Rename</span>
          <input
            value={formValues.name || ""}
            onChange={handleInputChange}
            name="name"
            className="flex w-full p-2 border rounded-md border-primary"
          />
        </div>
        <div className="flex flex-col font-semibold">
          <span className="ml-1 text-[12px] ">Start Date (optional)</span>
          <input
            value={formValues.projected_start_date || ""}
            onChange={handleInputChange}
            name="projected_start_date"
            className="flex w-full p-2 border rounded-md border-primary"
            type="datetime-local"
          />
        </div>
        <div className="flex flex-col font-semibold">
          <span className="ml-1 text-[12px]">End Date (options)</span>
          <input
            value={formValues.projected_end_date || ""}
            onChange={handleInputChange}
            name="projected_end_date"
            className="flex w-full p-2 border rounded-md border-primary"
            type="datetime-local"
          />
        </div>
      </div>
    </>
  );
};

export default ScoringSettings;
