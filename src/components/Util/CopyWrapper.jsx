import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const CopyWrapper = ({ copyString, size = 20, children }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (!navigator.clipboard) {
      console.log("Clipboard API not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(copyString);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.log("Could not copy:", err);
    }
  };

  return (
    <div
      onClick={copyToClipboard}
      className="flex items-center w-full h-full gap-2 transition-all duration-300 ease-in-out cursor-pointer"
      title="Copy to clipboard"
    >
      {children}
      <div
        className={`transition-all duration-300 ease-in-out ${
          copySuccess ? "text-green-500" : ""
        }`}
      >
        {copySuccess ? (
          <AssignmentTurnedInOutlinedIcon sx={{ fontSize: size }} />
        ) : (
          <ContentCopyIcon sx={{ fontSize: size }} />
        )}
      </div>
    </div>
  );
};

export default CopyWrapper;
