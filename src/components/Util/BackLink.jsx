import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/** The quiet way back: a small arrow + the DESTINATION's name, muted so it
 * recedes behind the page title. "Back" alone makes you remember where you
 * came from; naming the destination means you don't have to. */
const BackLink = ({ to, label = "Back" }) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center gap-1 -ml-1 text-sm font-semibold text-light active:text-near-black"
      onClick={() => navigate(to)}
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      {label}
    </button>
  );
};

export default BackLink;
