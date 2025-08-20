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
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>

        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppTheme>
  );
}
