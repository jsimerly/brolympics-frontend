import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/** Shared wizard shell: step dots, title block, scrollable body, and a
 * primary action that disables until the page is valid. */
const CreateWrapper = ({
  button_text,
  step,
  totalSteps,
  submit,
  back,
  disabled = false,
  title,
  description,
  children,
}) => {
  return (
    <div
      className="absolute flex flex-col w-full px-4 py-6 h-[calc(100vh-100px)] sm:px-6 bg-gray-100"
      style={{ transform: `translateX(${100 * (step - 1)}%)` }}
    >
      <div className="flex flex-col w-full h-full max-w-2xl mx-auto bg-white shadow-md rounded-border">
        <div className="p-4">
          {totalSteps > 1 && (
            <div className="flex items-center gap-1.5 pb-3">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i + 1 === step
                      ? "w-6 bg-primary"
                      : i + 1 < step
                      ? "w-1.5 bg-primary/40"
                      : "w-1.5 bg-gray-200"
                  }`}
                />
              ))}
              <span className="ml-2 text-[11px] font-semibold tracking-wide uppercase text-light">
                Step {step} of {totalSteps}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {back && (
              <button onClick={back} aria-label="Back" className="text-light">
                <ArrowBackIcon />
              </button>
            )}
            <h2 className="header-3 text-near-black">{title}</h2>
          </div>
          <p className="text-sm text-light">{description}</p>
        </div>
        <div className="flex-grow px-4 overflow-y-auto">{children}</div>
        <div className="p-4">
          <button
            className={`flex items-center justify-between w-full transition-colors ${
              disabled
                ? "px-4 py-3 font-semibold text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
                : "primary-btn"
            }`}
            onClick={disabled ? undefined : submit}
            disabled={disabled}
          >
            <span className="invisible">
              <ArrowForwardIcon />
            </span>
            <span>{button_text}</span>
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWrapper;
