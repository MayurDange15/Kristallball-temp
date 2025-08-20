import { Routes, Route, Navigate } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import SignIn from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AppTheme from "./shared-theme/AppTheme.jsx";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  formInputCustomizations,
  sidebarCustomizations,
} from "./shared-theme/customizations/";
import { CssBaseline } from "@mui/material";

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function App() {
  return (
    <AppTheme themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
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
        <Route
          path="/purchases"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Purchases />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transfers"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Transfers />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Assignments />
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
