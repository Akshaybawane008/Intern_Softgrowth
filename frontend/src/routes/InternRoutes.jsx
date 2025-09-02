// src/routes/InternRoutes.js
import { Routes, Route } from "react-router-dom";
import InternSidebar from "../pages/intern/InternSidebar";

function InternRoutes() {
  return (
    <div className="flex">
      <InternSidebar />
      <Routes>
        {/* Example Intern Pages */}
        <Route path="dashboard" element={<h1>Intern Dashboard</h1>} />
        <Route path="tasks" element={<h1>My Tasks</h1>} />
      </Routes>
    </div>
  );
}

export default InternRoutes;
