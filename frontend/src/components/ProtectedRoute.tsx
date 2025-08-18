import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthContextDefinations";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("AuthContext must be used inside AuthProvider");

  const { user, loading } = auth;
  if (loading) return null; // Later replace with spinner

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
