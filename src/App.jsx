import { Suspense, lazy, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Leagues from "./components/brolympics/league/Leagues.jsx";
import { fetchLeagues } from "./api/client";
import Notification, {
  useNotification,
} from "./components/Util/Notification.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AuthRouter from "./components/auth/AuthRouter.jsx";
import ProtectedRoute from "./routing/ProtectedRoutes.jsx";
import About from "./components/home/About.jsx";
import { SkeletonPage } from "./components/Util/Skeleton.jsx";
import "./firebase/firebaseConfig";

// Route-level code splitting: the landing/auth/leagues shell loads first;
// the heavy trees (game day, stats pages, the wizard with its event catalog,
// the rich-text editor) arrive when navigated to. One 1.2MB bundle was the
// whole "app feels slow" first-load (perf audit 2026-07-22).
const Brolympics = lazy(() => import("./components/brolympics/Brolympics.jsx"));
const LeagueRouter = lazy(() =>
  import("./components/brolympics/league/LeagueRouter.jsx")
);
const StartLeague = lazy(() =>
  import("./components/create_league_page/StartLeague.jsx")
);
const Invites = lazy(() => import("./components/invites/Invites.jsx"));

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
          tone={notification.tone}
          onClose={() => showNotification("")}
        />
      )}
      <Suspense
        fallback={
          <div className="w-full max-w-3xl mx-auto container-padding">
            <SkeletonPage />
          </div>
        }
      >
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
      </Suspense>
    </div>
  );
}

export default App;
