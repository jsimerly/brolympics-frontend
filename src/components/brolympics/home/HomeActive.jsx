import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import AvailableCompetition from "./AvailableCompetition.jsx";
import ActiveCompetition from "./ActiveCompetition.jsx";
import HomeAdminActive from "./HomeAdminActive.jsx";

import { fetchActiveHome, confirmContest } from "../../../api/client";
import Schedule from "./Schedule.jsx";

/** A self-reported result from the other side, waiting on my word. */
const ConfirmCard = ({ uuid, event_name, entries = [], recorded_by_name }) => {
  const [busy, setBusy] = useState(false);
  const [entry_1, entry_2] = entries;
  const scoreOf = (entry) =>
    entry?.score ?? ({ w: "W", l: "L", t: "T" }[entry?.outcome] || "—");

  const confirm = async () => {
    setBusy(true);
    try {
      await confirmContest(uuid);
      location.reload();
    } catch (error) {
      console.error("Error confirming result:", error);
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white border rounded-lg shadow-md">
      <div className="min-w-0">
        <h3 className="font-semibold">{event_name}</h3>
        <p className="text-sm text-gray-600">
          {entry_1?.team_name} {scoreOf(entry_1)} : {scoreOf(entry_2)}{" "}
          {entry_2?.team_name}
        </p>
        <p className="text-xs text-gray-400">
          recorded by {recorded_by_name} — wrong? ask your commissioner to undo
          it
        </p>
      </div>
      <button
        className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-tertiary shrink-0 disabled:opacity-50"
        onClick={confirm}
        disabled={busy}
      >
        {busy ? "..." : "Confirm"}
      </button>
    </div>
  );
};

const CurrentEventCard = ({ name, percent_complete }) => (
  <div className="p-4 mb-4 bg-white border rounded-lg shadow-md">
    <h3 className="mb-2 text-lg font-semibold">{name}</h3>
    <div className="relative w-full h-2 overflow-hidden bg-gray-200 rounded-full">
      <div
        className="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out bg-primary"
        style={{ width: `${percent_complete}%` }}
      />
    </div>
    <span className="text-sm text-gray-600">{percent_complete}% complete</span>
  </div>
);

const getComponent = (type, props, isAvailable) => {
  const Component = isAvailable ? AvailableCompetition : ActiveCompetition;
  return <Component {...props} />;
};

const EventBlock = ({ title, items, component_func }) => (
  <div className="mb-6">
    <h2 className="mb-4 text-xl font-bold">
      {title}
      {items.length !== 1 && "s"}
    </h2>
    {items.length === 0 ? (
      <p className="text-gray-500">No {title.toLowerCase()}</p>
    ) : (
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="order">
            {component_func ? (
              component_func(item.type, item)
            ) : (
              <CurrentEventCard {...item} />
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AdminSwitch = ({ adminView, setAdminView }) => (
  <div className="flex mb-6 overflow-hidden bg-white rounded-lg shadow-md">
    {["Home", "Admin"].map((label) => (
      <button
        key={label}
        className={`w-1/2 py-3 text-center font-semibold transition-colors duration-200 ${
          (adminView && label === "Admin") || (!adminView && label === "Home")
            ? "bg-primary text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
        onClick={() => setAdminView(label === "Admin")}
      >
        {label}
      </button>
    ))}
  </div>
);

const HomeActive = ({ is_admin }) => {
  const [adminView, setAdminView] = useState(false);
  const [homeData, setHomeData] = useState({
    active_events: [],
    available_competitions: [],
    active_competitions: [],
    upcoming_events: [],
    pending_confirmations: [],
  });

  const { uuid } = useParams();

  useEffect(() => {
    const getHomeInfo = async () => {
      try {
        const data = await fetchActiveHome(uuid);
        setHomeData(data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    getHomeInfo();
  }, [uuid]);

  return (
    <div className="max-w-md px-4 py-6 mx-auto sm:px-6 lg:px-8">
      {is_admin && (
        <AdminSwitch adminView={adminView} setAdminView={setAdminView} />
      )}
      {adminView ? (
        <HomeAdminActive />
      ) : (
        <div>
          {(homeData.pending_confirmations || []).length > 0 && (
            <EventBlock
              title="Unconfirmed Result"
              items={homeData.pending_confirmations}
              component_func={(type, props) => <ConfirmCard {...props} />}
            />
          )}
          {homeData.active_events.length > 0 && (
            <>
              <EventBlock
                title="Available Competition"
                items={homeData.available_competitions}
                component_func={(type, props) =>
                  getComponent(type, props, true)
                }
              />
              <EventBlock
                title="Active Event"
                items={homeData.active_events}
                component_func={null}
              />
              <EventBlock
                title="Active Competition"
                items={homeData.active_competitions}
                component_func={(type, props) =>
                  getComponent(type, props, false)
                }
              />
              <div className="w-full h-[1px] rounded-md bg-gray-200 mt-6" />
            </>
          )}
          <div className="mt-6">
            <Schedule events={homeData.upcoming_events || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeActive;
