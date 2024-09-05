import { useState, useEffect } from "react";
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
        console.log(error.message);
      }
    };
    if (firebaseUser) {
      getInfo();
    }
  }, [firebaseUser]);

  useEffect(() => {}, [firebaseUser]);

  return (
    <>
      {open && (
        <div className="fixed top-[59px] left-0 w-full z-30">
          {view === "account" ? (
            <Account setView={setView} />
          ) : (
            <div className="flex flex-col h-[calc(100vh-60px)] bg-neutral text-white opacity-[99%] px-6 py-3 gap-3 overflow-auto">
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
                  {/* <UpcomingCompetitions upcoming_competitions={upcomingComps} setOpen={setOpen}/>     */}
                </>
              ) : (
                <div>
                  You're not currently logged in. To create an account or login{" "}
                  <a className="underline " href="/sign-up">
                    {" "}
                    please click here.
                  </a>
                </div>
              )}
            </div>
          )}

          <div>
            <Options user={user} setView={setView} />
          </div>
        </div>
      )}
    </>
  );
};

export default Slideout;
