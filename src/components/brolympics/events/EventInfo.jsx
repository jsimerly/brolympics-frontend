import React from "react";
import { format, parseISO } from "date-fns";

export const EventInfo = ({ event }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) {
      return "";
    }
    return format(parseISO(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
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
          <h2 className="mb-4 header-3">Rules</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: event.rules }}
          />
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
            {event.min_score !== null && (
              <p>
                <strong>Minimum Score:</strong> {event.min_score}
              </p>
            )}
            {event.max_score !== null && (
              <p>
                <strong>Maximum Score:</strong> {event.max_score}
              </p>
            )}
            <p>
              <strong>Decimal Places:</strong> {event.decimal_places}
            </p>
            {event.n_matches && (
              <p>
                <strong>Number of Matches:</strong> {event.n_matches}
              </p>
            )}
            {event.n_competitions && (
              <p>
                <strong>Number of Competitions:</strong> {event.n_competitions}
              </p>
            )}
            {event.n_active_limit && (
              <p>
                <strong>Active Limit:</strong> {event.n_active_limit}
              </p>
            )}
            {event.n_bracket_teams && (
              <p>
                <strong>Number of Bracket Teams:</strong>{" "}
                {event.n_bracket_teams}
              </p>
            )}
            {(event.type === "ind" || event.type === "team") && (
              <p>
                <strong>Display Average Scores:</strong>{" "}
                {event.display_avg_scores ? "Yes" : "No"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
