import Img from "../../Util/Img";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const Side = ({ name, record, img, seed, reverse = false }) => (
  <div
    className={`flex items-center flex-1 min-w-0 gap-2 ${
      reverse ? "flex-row-reverse" : ""
    }`}
  >
    <Img
      src={img}
      alt={name}
      className="object-cover w-12 h-12 rounded-lg shrink-0"
    />
    <div
      className={`flex flex-col min-w-0 ${
        reverse ? "items-end text-end" : "items-start"
      }`}
    >
      <span className="w-full text-sm font-semibold leading-tight truncate">
        {name || "TBD"}
      </span>
      {seed ? (
        <span className="text-[11px] text-light">#{seed} seed</span>
      ) : record ? (
        <span className="text-[11px] text-light">{record}</span>
      ) : null}
    </div>
  </div>
);

/** A matchup row: two sides mirrored around a quiet vs (bracket games get
 * the little tree). */
const TeamsBlock = ({
  name,
  team_1_name,
  team_1_record,
  team_1_img,
  team_2_name,
  team_2_record,
  team_2_img,
  team_1_seed,
  team_2_seed,
  is_bracket,
}) => (
  <div>
    {name && <h2 className="pb-2 text-sm font-semibold">{name}</h2>}
    <div className="flex items-center gap-2">
      <Side
        name={team_1_name}
        record={team_1_record}
        img={team_1_img}
        seed={team_1_seed}
      />
      <span className="flex flex-col items-center px-1 shrink-0 text-light">
        {is_bracket && <AccountTreeOutlinedIcon sx={{ fontSize: 14 }} />}
        <span className="text-xs font-semibold">vs</span>
      </span>
      <Side
        name={team_2_name}
        record={team_2_record}
        img={team_2_img}
        seed={team_2_seed}
        reverse
      />
    </div>
  </div>
);

export default TeamsBlock;
