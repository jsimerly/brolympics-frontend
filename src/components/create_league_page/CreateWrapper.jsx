import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CreateWrapper = ({
  color,
  button_text,
  step,
  submit,
  title,
  description,
  children,
}) => {
  return (
    <div
      className="absolute flex flex-col w-full px-4 py-6 h-[calc(100vh-100px)] sm:px-6 bg-gray-100"
      style={{ transform: `translateX(${100 * (step - 1)}%)` }}
    >
      <div className="flex flex-col h-full bg-white shadow-md rounded-border">
        <div className="p-4 border-gray-200">
          <h2 className={`header-3 text-${color}`}>{title}</h2>
          <p className="text-sm text-light">{description}</p>
        </div>
        <div className="flex-grow px-4 overflow-y-auto">{children}</div>
        <div className="p-4">
          <button
            className="flex items-center justify-between w-full primary-btn"
            onClick={submit}
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
