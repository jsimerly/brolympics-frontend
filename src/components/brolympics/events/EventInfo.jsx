import React from "react";
import { format, parseISO } from "date-fns";
import HeadToHead from "./eventInfo/H2hInfo";
import Individual from "./eventInfo/IndInfo";
import TeamEvent from "./eventInfo/TeamInfo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillDisplay = ({ content }) => {
  return (
    <>
      <style>
        {`
          .quill-display-container .quill {
            border: none;
          }
          .quill-display-container .ql-container {
            border: none;
          }
          .quill-display-container .ql-editor {
            padding: 0;
          }
          .quill-display-container .ql-editor p {
            margin-bottom: 1em;
          }
        `}
      </style>
      <div className="quill-display-container">
        <h2 className="mb-4 header-3">Rules</h2>
        <ReactQuill
          value={content}
          readOnly={true}
          theme="snow"
          modules={{ toolbar: false }}
        />
      </div>
    </>
  );
};

export default QuillDisplay;

export const EventInfo = ({ event }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) {
      return "";
    }
    return format(parseISO(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const renderEventTypeDetails = () => {
    switch (event.type) {
      case "h2h":
        return <HeadToHead />;
      case "ind":
        return <Individual />;
      case "team":
        return <TeamEvent />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Time and Location */}
        <div className="p-4 card">
          <h2 className="mb-4 header-3">Time and Location</h2>
          <p>
            <strong>Start:</strong> {formatDateTime(event.projected_start_date)}
          </p>
          <p>
            <strong>End:</strong> {formatDateTime(event.projected_end_date)}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        </div>

        {/* Rules */}
        <div className="p-4 card">
          <QuillDisplay content={event.rules} />
        </div>

        {/* Event Settings */}
        <div className="p-4 card">
          <h2 className="mb-4 header-3">Event Settings</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <p>
              <strong>Type:</strong> {event.type}
            </p>
            <p>
              <strong>Scoring:</strong>{" "}
              {event.is_high_score_wins ? "High score wins" : "Low score wins"}
            </p>
            {event.config?.min_score != null && (
              <p>
                <strong>Minimum Score:</strong> {event.config.min_score}
              </p>
            )}
            {event.config?.max_score != null && (
              <p>
                <strong>Maximum Score:</strong> {event.config.max_score}
              </p>
            )}
            {(event.stages || []).map((stage) => (
              <p key={stage.uuid}>
                <strong>Stage {stage.order + 1}:</strong>{" "}
                {stage.structure.replace("_", " ")}
                {stage.config?.games_per_team &&
                  ` — ${stage.config.games_per_team} games per team`}
                {stage.config?.rounds && ` — ${stage.config.rounds} rounds`}
                {stage.config?.take && ` — top ${stage.config.take} advance`}
              </p>
            ))}
          </div>
        </div>

        {/* Event Type Details */}
        <div className="p-4 card">
          <h2 className="mb-4 header-3">Event Type Details</h2>
          {renderEventTypeDetails()}
        </div>
      </div>
    </div>
  );
};
