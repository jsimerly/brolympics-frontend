import React from "react";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

const Schedule = ({ events }) => {
  console.log(events);
  const navigate = useNavigate();
  const { uuid } = useParams();

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (event.projected_start_date) {
      const date = format(parseISO(event.projected_start_date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
    }
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  const handleSelect = (event) => {
    localStorage.setItem("selectedEventUuid", event.uuid);
    localStorage.setItem("selectedEventType", event.type);
    navigate(`/b/${uuid}/event/${event.type}/${event.uuid}`);
  };

  const formatDate = (dateString) => {
    return dateString ? format(parseISO(dateString), "h:mm a") : "TBD";
  };

  return (
    <div className="">
      <h2 className="mb-2 text-2xl font-bold text-primary">Schedule</h2>
      {sortedDates.map((date) => (
        <div key={date} className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="space-y-2">
            {groupedEvents[date]
              .sort(
                (a, b) =>
                  new Date(a.projected_start_date || 0) -
                  new Date(b.projected_start_date || 0)
              )
              .map((event) => (
                <button
                  key={event.uuid}
                  className="w-full p-4 card"
                  onClick={() => handleSelect(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="pr-4 text-start">
                      <h4 className="text-lg font-medium">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium">
                        {formatDate(event.projected_start_date)} -{" "}
                        {formatDate(event.projected_end_date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.projected_start_date
                          ? format(
                              parseISO(event.projected_start_date),
                              "MMM d"
                            )
                          : "Date TBD"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
