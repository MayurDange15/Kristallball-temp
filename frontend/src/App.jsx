import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
// import AppTheme from "./shared-theme/AppTheme.jsx";
import AppTheme from "./shared-theme/AppTheme"; // ensure .jsx extension

export default function App() {
  return (
    <AppTheme>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppTheme>
  );
}
