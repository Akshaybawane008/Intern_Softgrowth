import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./layouts/Sidebar";        // Admin Sidebar
import Header from "./layouts/Header";        // Admin Header
import InternSidebar from "./pages/InternSidebar"; // Intern Sidebar
import LoginPage from "./pages/LoginPage";        // Login Page
import InternDashboard from "./pages/InternDashboard"; // Example Intern Page

// Protected Route (checks role)
const PrivateRoute = ({ children, role }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) return <Navigate to="/login" />;
  if (auth.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Panel Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role="admin">
              <div className="flex-1">
                <Sidebar />
              </div>
            </PrivateRoute>
          }
        />

        {/* Intern Panel Routes */}
        <Route
          path="/intern/*"
          element={
            <PrivateRoute role="intern">
              <div className="flex">
                <InternSidebar />
                <div className="flex-1">
                  
                  <Routes>
                    <Header />
                    <Route path="dashboard" element={<InternDashboard />} />
                    {/* You can add more intern pages here */}
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Default: redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
