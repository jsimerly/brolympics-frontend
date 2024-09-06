import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/Navbar.jsx";
import StartLeague from "./components/create_league_page/StartLeague.jsx";
import Brolympics from "./components/brolympics/Brolympics.jsx";
import Leagues from "./components/brolympics/league/Leagues.jsx";
import Invites from "./components/invites/Invites.jsx";
import { fetchLeagues } from "./api/league.js";
import Notification, {
  useNotification,
} from "./components/Util/Notification.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LeagueRouter from "./components/brolympics/league/LeagueRouter.jsx";
import AuthRouter from "./components/auth/AuthRouter.jsx";
import ProtectedRoute from "./routing/ProtectedRoutes.jsx";

import "./firebase/firebaseConfig";
import { fetchCSRFToken } from "./api/axios.js";
import About from "./components/home/About.jsx";
fetchCSRFToken();

console.log("We're in App.jsx");
console.log(import.meta.env.VITE_FRONTEND_URL);

function App() {
  const [leagues, setLeagues] = useState([]);
  const { notification, showNotification } = useNotification();
  const { firebaseUser } = useAuth();

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const data = await fetchLeagues();
        setLeagues(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (firebaseUser) {
      getLeagues();
    }
  }, [firebaseUser]);

  console.log("Environment Variables:", {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
    VITE_FB_API_KEY: import.meta.env.VITE_FB_API_KEY,
    VITE_FB_AUTH_DOMAIN: import.meta.env.VITE_FB_AUTH_DOMAIN,
    VITE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
    VITE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
    VITE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
    VITE_APP_ID: import.meta.env.VITE_APP_ID,
    VITE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
  });

  return (
    <div className="min-h-screen text-white bg-neutral">
      <Navbar leagues={leagues} />
      {notification.show && (
        <Notification
          message={notification.message}
          className={notification.className}
          onClose={() => showNotification("", "", false)}
        />
      )}
      <Routes>
        {/* Public routes */}
        {/* <Route path="/home" element={<Home />} /> */}
        <Route
          path="/auth/*"
          element={firebaseUser ? <Navigate to="/" replace /> : <AuthRouter />}
        />
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Leagues leagues={leagues} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-league"
          element={
            <ProtectedRoute>
              <StartLeague />
            </ProtectedRoute>
          }
        />
        <Route
          path="/league/:uuid/*"
          element={
            <ProtectedRoute>
              <LeagueRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/b/:uuid/*"
          element={
            <ProtectedRoute>
              <Brolympics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite/*"
          element={
            <ProtectedRoute>
              <Invites />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/about" replace />} />
      </Routes>
    </div>
  );
}

export default App;
