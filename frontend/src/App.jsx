import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoutes from "./routes/AdminRoutes";
import InternRoutes from "./routes/InternRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role="admin">
              <AdminRoutes />
            </PrivateRoute>
          }
        />

        {/* Intern */}
        <Route
          path="/intern/*"
          element={
            <PrivateRoute role="intern">
              <InternRoutes />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
