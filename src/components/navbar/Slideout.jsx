import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import CurrentBrolympics from "./CurrentBrolympics.jsx";
import LeaguesButtons from "./LeaguesButtons.jsx";
import Options from "./Options.jsx";
import UpcomingBrolympics from "./UpcomingBrolympics";
import UpcomingCompetitions from "./UpcomingComps";
import Account from "./Account.jsx";
import { fetchUpcoming } from "../../api/league.js";

const Slideout = ({ open, leagues, setOpen }) => {
  const [view, setView] = useState("leagues");
  const { firebaseUser, user } = useAuth();
  const [currentBro, setCurrentBro] = useState([]);
  const [upcomingBro, setUpcomingBro] = useState([]);
  const [upcomingComps, setUpcomingComps] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await fetchUpcoming();
        setCurrentBro(data["current_brolympics"]);
        setUpcomingBro(data["upcoming_brolympics"]);
        setUpcomingComps(data["upcoming_competitions"]);
      } catch (error) {
        console.error("Error fetching upcoming events:", error.message);
      }
    };
    if (firebaseUser) {
      getInfo();
    }
  }, [firebaseUser]);

  if (user && !user.account_complete) {
    return <Account setView={setView} />;
  }

  return (
    <>
      {open && (
        <div className="fixed top-[60px] left-0 w-full h-screen-minus-nav z-30 bg-white shadow-lg overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              {view === "account" ? (
                <Account setView={setView} />
              ) : (
                <div className="py-4 space-y-6 container-padding">
                  {firebaseUser ? (
                    <>
                      <LeaguesButtons leagues={leagues} setOpen={setOpen} />
                      <CurrentBrolympics
                        current_brolympics={currentBro}
                        setOpen={setOpen}
                      />
                      <UpcomingBrolympics
                        upcoming_brolympics={upcomingBro}
                        setOpen={setOpen}
                      />
                      <UpcomingCompetitions
                        upcoming_competitions={upcomingComps}
                        setOpen={setOpen}
                      />
                      <div className="h-[100px]" />
                    </>
                  ) : (
                    <div className="p-4 card">
                      <p className="mb-2 text-light">
                        You're not currently logged in.
                      </p>
                      <p className="text-light">
                        To create an account or login,{" "}
                        <a
                          href="/sign-up"
                          className="text-primary hover:underline"
                        >
                          please click here.
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200">
              <Options user={user} setView={setView} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Slideout;
