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

const CurrentEventCard = ({ name, percent_complete }) => (
  <div className="pb-1 rounded-md ">
    <h3 className="pb-2">{name}</h3>
    <div className="relative h-[2px] w-full bg-gray-200 rounded-full ">
      <div
        className="absolute top-0 left-0 w-full h-full duration-200 ease-in-out rounded-full transition-width bg-primary"
        style={{ width: `${percent_complete}%` }}
      />
    </div>
  </div>
);

const getAvailableComponent = (type, props) => {
  switch (type) {
    case "h2h":
      return <AvailableCompetition_h2h {...props} />;
    case "ind":
      return <AvailableCompetition_ind {...props} />;
    case "team":
      return <AvailableCompetition_team {...props} />;
    case "bracket":
      return <AvailableCompetition_h2h {...props} />;
    default:
      return null;
  }
};

const getActiveComponent = (type, props) => {
  switch (type) {
    case "h2h":
      return <ActiveCompetition_h2h {...props} />;
    case "bracket":
      return <ActiveCompetition_h2h {...props} />;
    case "ind":
      return <ActiveCompetition_ind {...props} />;
    case "team":
      return <ActiveCompetition_team {...props} />;
    default:
      return null;
  }
};

const EventBlock = ({ title, items, component: Component, component_func }) => {
  return (
    <div>
      <h2 className="text-[20px] font-bold pb-2">
        {title}
        {items.length > 1 && "s"}
      </h2>
      {items.length === 0 ? (
        `No ${title}`
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => {
            return (
              <div key={i}>
                {component_func === null ? (
                  <Component {...item} />
                ) : (
                  <div>
                    {i !== 0 && (
                      <div className="w-full h-[1px] bg-neutralLight my-2" />
                    )}
                    {React.cloneElement(component_func(item.type, item), {
                      key: i,
                    })}
                  </div>
                )}
                {/* Add divider here except for the last item */}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const AdminSwitch = ({ adminView, setAdminView }) => {
  const homeClick = () => {
    setAdminView(false);
  };
  const adminClick = () => {
    setAdminView(true);
  };

  return (
    <div className="flex items-center justify-center w-full pb-3 font-semibold">
      <button
        className={`${
          adminView ? "text-neutralLight" : "text-white opacity-60"
        }`}
        onClick={homeClick}
      >
        Home
      </button>
      <span className="px-6 opacity-60">|</span>
      <button
        className={`${
          !adminView ? "text-neutralLight" : "text-white opacity-60"
        }`}
        onClick={adminClick}
      >
        Admin
      </button>
    </div>
  );
};

const HomeActive = ({ is_owner }) => {
  const [adminView, setAdminView] = useState(false);
  const [homeData, setHomeData] = useState({
    active_events: [],
    available_competitions: [],
    active_competitions: [],
  });

  const navigate = useNavigate();
  const { uuid } = useParams();

  useEffect(() => {
    const getHomeInfo = async () => {
      try {
        const data = await fetchHome(uuid);
        setHomeData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getHomeInfo();
  }, []);

  return (
    <div className="px-6 py-3">
      {is_owner && (
        <AdminSwitch adminView={adminView} setAdminView={setAdminView} />
      )}
      {adminView ? (
        <HomeAdminActive />
      ) : (
        <div className="flex flex-col gap-3">
          <EventBlock
            title="Active Event"
            items={homeData.active_events}
            component={CurrentEventCard}
            component_func={null}
          />
          <EventBlock
            title="Available Competition"
            items={homeData.available_competitions}
            component={AvailableCompetition_h2h}
            component_func={getAvailableComponent}
          />
          <EventBlock
            title="Active Competition"
            items={homeData.active_competitions}
            component={ActiveCompetition_h2h}
            component_func={getActiveComponent}
          />
        </div>
      )}
    </div>
  );
};

export default HomeActive;
