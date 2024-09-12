import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import AvailableCompetition_h2h from "./h2h/AvailableCompetition_h2h.jsx";
import ActiveCompetition_h2h from "./h2h/ActiveCompetition_h2h.jsx";
import AvailableCompetition_ind from "./ind/AvailableCompetition_ind.jsx";
import ActiveCompetition_ind from "./ind/ActiveCompetition_ind.jsx";
import AvailableCompetition_team from "./team/AvailableCompetition_team.jsx";
import ActiveCompetition_team from "./team/ActiveCompetition_team.jsx";
import HomeAdminActive from "./HomeAdminActive.jsx";

import { fetchHome } from "../../../api/activeBro/home.js";
import Schedule from "./Schedule.jsx";

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
  const components = {
    h2h: isAvailable ? AvailableCompetition_h2h : ActiveCompetition_h2h,
    ind: isAvailable ? AvailableCompetition_ind : ActiveCompetition_ind,
    team: isAvailable ? AvailableCompetition_team : ActiveCompetition_team,
    bracket: isAvailable ? AvailableCompetition_h2h : ActiveCompetition_h2h,
  };
  const Component = components[type] || null;
  return Component ? <Component {...props} /> : null;
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

const HomeActive = ({ is_owner }) => {
  const [adminView, setAdminView] = useState(false);
  const [homeData, setHomeData] = useState({
    active_events: [],
    available_competitions: [],
    active_competitions: [],
    upcoming_events: [],
  });

  const { uuid } = useParams();

  useEffect(() => {
    const getHomeInfo = async () => {
      try {
        const data = await fetchHome(uuid);
        setHomeData(data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    getHomeInfo();
  }, [uuid]);

  return (
    <div className="max-w-md px-4 py-6 mx-auto sm:px-6 lg:px-8">
      {is_owner && (
        <AdminSwitch adminView={adminView} setAdminView={setAdminView} />
      )}
      {adminView ? (
        <HomeAdminActive />
      ) : (
        <div>
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
