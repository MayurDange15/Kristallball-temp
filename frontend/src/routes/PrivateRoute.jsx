import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    // Optional: show a splash or null to avoid flicker while loading localStorage
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
