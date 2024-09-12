import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import About from "./components/home/About.jsx";
import "./firebase/firebaseConfig";
import { fetchCSRFToken } from "./api/axios.js";

fetchCSRFToken();

function App() {
  const [leagues, setLeagues] = useState([]);
  const { notification, showNotification } = useNotification();
  const { firebaseUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (location.pathname.startsWith("/invite/") && !firebaseUser && !loading) {
    
      sessionStorage.setItem("pendingInvite", location.pathname);
      navigate("/auth/login", { state: { from: location } });
    } else if (firebaseUser && sessionStorage.getItem("pendingInvite")) {
      const pendingInvite = sessionStorage.getItem("pendingInvite");
      sessionStorage.removeItem("pendingInvite");
      navigate(pendingInvite);
    }
  }, [firebaseUser, loading, location, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
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
        <Route
          path="/auth/*"
          element={firebaseUser ? <Navigate to="/" replace /> : <AuthRouter />}
        />
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route
          path="/"
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
