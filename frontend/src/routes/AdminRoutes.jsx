// src/routes/AdminRoutes.js
import { Routes, Route } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";

function AdminRoutes() {
  return (
    <div className="flex-1">
      <Sidebar />
      <Routes>
        {/* Example Admin Pages */}
        <Route path="dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="users" element={<h1>Manage Users</h1>} />
      </Routes>
    </div>
  );
}

export default AdminRoutes;
