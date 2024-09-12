import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { firebaseUser } = useAuth();
  const location = useLocation();

  if (!firebaseUser) {
    return <Navigate to={`/auth?redirectTo=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
